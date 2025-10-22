import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { AI_MODEL_FLASH, AI_MODEL_PRO } from "@/lib/config";
import type { FileParseResult } from "../shared/file-parsers/base-parser";
import { enforceSummaryLimit } from "../shared/summary-limiter";
import type { ParsedResumeSchema } from "../shared-parsed-resume-schema";
import { getPrecisionExtractionPrompt } from "./generator-prompts";

// This will be expanded with more metadata later
interface ProcessingResult {
  data: ParsedResumeSchema;
  meta: {
    method: string;
    confidence: number;
    processingType: "generator";
    fileType: string;
    processingTime?: number;
  };
}

interface CustomizationOptions {
  profileImage?: string;
  customColors?: Record<string, string>;
}

class GeneratorProcessor {
  async process(fileResult: FileParseResult, customization?: CustomizationOptions): Promise<ProcessingResult> {
    const startTime = Date.now();

    const model = google(AI_MODEL_FLASH); // Use AI_MODEL_FLASH for resume parsing, it supports PDF processing
    console.warn("GEMINI FLASH is parsing... replace with", AI_MODEL_PRO);
    const messagesContent: unknown[] = [];

    if (fileResult.fileType === "pdf" && fileResult.fileData) {
      // For PDF files, send the ArrayBuffer directly as a file input
      messagesContent.push({
        type: "file",
        data: new Uint8Array(fileResult.fileData),
        mimeType: "application/pdf",
      });
      // Add a text part for instructions
      messagesContent.push({
        type: "text",
        text: getPrecisionExtractionPrompt("", "pdf"), // Pass empty string as content, as fileData is sent separately
      });
    } else {
      // For text files, send the content as text
      messagesContent.push({
        type: "text",
        text: getPrecisionExtractionPrompt(fileResult.content, fileResult.fileType),
      });
    }

    console.log("[Generator] Sending messages content to AI:", messagesContent);

    const { text } = await generateText({
      model,
      messages: [
        {
          role: "user",
          content: messagesContent as unknown as string,
        },
      ],
      temperature: 0.2,
    });

    // Strip markdown code block and extract JSON
    let cleanText = text.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.replace(/^```json\s*/, "");
    }
    if (cleanText.endsWith("```")) {
      cleanText = cleanText.replace(/```\s*$/, "");
    }

    // Extract only the first valid JSON object
    const firstBrace = cleanText.indexOf("{");
    const lastBrace = cleanText.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanText = cleanText.substring(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(cleanText) as ParsedResumeSchema;

    // Apply customizations
    const customizedResume = this.applyCustomizations(parsed, customization);

    // SAFE ADDITION: Enforce summary length post-parse using a lightweight model.
    // This runs only if summary exceeds the limit and will fall back safely.
    const lengthSafeResume = await enforceSummaryLimit(customizedResume);

    const processingTime = Date.now() - startTime;
    const confidence = this.calculateConfidence(customizedResume);

    return {
      data: lengthSafeResume,
      meta: {
        method: "ai-precision-pdf",
        confidence,
        processingType: "generator",
        fileType: fileResult.fileType,
        processingTime,
      },
    };
  }

  private calculateConfidence(parsed: ParsedResumeSchema): number {
    let score = 0;
    let maxScore = 0;

    // Name and title are critical
    if (parsed.name && !parsed.name.includes("Placeholder")) {
      score += 0.25;
    }
    maxScore += 0.25;

    if (parsed.title && !parsed.title.includes("Placeholder")) {
      score += 0.25;
    }
    maxScore += 0.25;

    // Experience completeness
    if (parsed.experience && parsed.experience.length > 0) {
      const expScore =
        parsed.experience.reduce((acc, exp) => {
          let expPoints = 0;
          if (exp.title) expPoints += 0.25;
          if (exp.company) expPoints += 0.25;
          if (exp.details && exp.details.length > 0) expPoints += 0.5;
          return acc + expPoints;
        }, 0) / parsed.experience.length;
      score += expScore * 0.3;
    }
    maxScore += 0.3;

    // Skills and other sections
    if (parsed.skills && parsed.skills.length > 0) {
      score += 0.1;
    }
    maxScore += 0.1;

    if (parsed.contact && Object.keys(parsed.contact).length > 0) {
      score += 0.1;
    }
    maxScore += 0.1;

    return Math.min(score / maxScore, 1.0);
  }

  private applyCustomizations(resume: ParsedResumeSchema, customization?: CustomizationOptions): ParsedResumeSchema {
    if (!customization) return resume;

    const customizedResume = { ...resume };

    // Apply profile image if provided and not empty
    if (customization.profileImage && customization.profileImage.trim() !== "") {
      customizedResume.profileImage = customization.profileImage;
      console.log("[Generator] Applied profile image to resume");
    }

    // Apply custom colors if provided
    if (customization.customColors && Object.keys(customization.customColors).length > 0) {
      customizedResume.customColors = customization.customColors;
      console.log("[Generator] Applied custom colors to resume:", Object.keys(customization.customColors));
    }

    return customizedResume;
  }
}

export const generatorProcessor = new GeneratorProcessor();
