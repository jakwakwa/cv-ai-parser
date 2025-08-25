import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import type { FileParseResult } from '../shared/file-parsers/base-parser';
import type { ParsedResumeSchema } from '../shared-parsed-resume-schema';
import { GENERATOR_CONFIG, getPrecisionExtractionPrompt } from './generator-prompts';

// This will be expanded with more metadata later
interface ProcessingResult {
  data: ParsedResumeSchema;
  meta: {
    method: string;
    confidence: number;
    processingType: 'generator';
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
    
    // Build precision-focused prompt
    const prompt = this.buildPrecisionPrompt(fileResult);
    console.log('[Generator] Using precision extraction for:', fileResult.fileName);
    console.log('[Generator] Content preview:', fileResult.content.substring(0, 200) + '...');

    // AI PDF processing if fileData is present and fileType is pdf
    if (fileResult.fileType === 'pdf' && fileResult.fileData) {
      const model = google('gemini-1.5-flash');
      const { text } = await generateText({
        model,
        messages: [{
          role: 'user',
          content: prompt,
        }],
        files: [{
          data: new Uint8Array(fileResult.fileData),
          mimeType: 'application/pdf',
        }],
      });

      // Strip markdown code block and extract JSON
      let cleanText = text.trim();
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '');
      }
      if (cleanText.endsWith('```')) {
        cleanText = cleanText.replace(/```\s*$/, '');
      }
      
      // Extract only the first valid JSON object
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanText = cleanText.substring(firstBrace, lastBrace + 1);
      }

      const parsed = JSON.parse(cleanText) as ParsedResumeSchema;
      
      // Apply customizations
      const customizedResume = this.applyCustomizations(parsed, customization);
      
      const processingTime = Date.now() - startTime;
      const confidence = this.calculateConfidence(customizedResume);

      return {
        data: customizedResume,
        meta: {
          method: 'ai-precision-pdf',
          confidence,
          processingType: 'generator',
          fileType: fileResult.fileType,
          processingTime,
        },
      };
    }

    // Fallback to placeholder processing for non-PDF or text-based content
    const placeholderResume = this.createPlaceholderResume(fileResult);
    
    // Apply customizations
    const customizedResume = this.applyCustomizations(placeholderResume, customization);
    
    const processingTime = Date.now() - startTime;
    const confidence = this.calculateConfidence(customizedResume);

    return {
      data: customizedResume,
      meta: {
        method: 'placeholder-with-extraction',
        confidence,
        processingType: 'generator',
        fileType: fileResult.fileType,
        processingTime,
      },
    };
  }

  private createPlaceholderResume(fileResult: FileParseResult): ParsedResumeSchema {
    // Extract name from filename as a placeholder
    const nameFromFile = fileResult.fileName
      .replace(/\.(pdf|txt)$/i, '')
      .replace(/[_-]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());

    // Check if this is a PDF that should be sent directly to AI
    const isPdfForAI = fileResult.content.startsWith('PDF_FILE_FOR_AI_PROCESSING');
    const hasRealTextContent = fileResult.fileType === 'txt' && 
                          !fileResult.content.includes('Placeholder content');
    
    let summary: string;
    
    if (isPdfForAI) {
      summary = `PDF Resume: ${fileResult.fileName} (${Math.round(fileResult.fileSize / 1024)}KB)

⚡ Ready for AI Processing with Gemini Flash Pro
This PDF will be sent directly to an AI model that can parse PDF objects natively.
No text extraction needed - the AI will handle both extraction and structuring.

[In production: Direct PDF → AI → Structured Resume Data]`;
    } else if (hasRealTextContent) {
      summary = `Extracted from ${fileResult.fileType.toUpperCase()} file: ${fileResult.content.substring(0, 300)}...`;
    } else {
      summary = `Resume content from ${fileResult.fileName}. [AI processing would extract and structure the actual resume content here]`;
    }

    return {
      name: nameFromFile || 'Resume Candidate',
      title: isPdfForAI ? 'Professional Title (AI will extract from PDF)' : 'Professional Title (extracted from resume)',
      summary,
      experience: [
        {
          title: isPdfForAI ? 'Position (AI extracted from PDF)' : 'Position Title',
          company: isPdfForAI ? 'Company (AI extracted from PDF)' : 'Company Name',
          role: isPdfForAI ? 'Role (AI extracted from PDF)' : 'Role Description',
          duration: isPdfForAI ? 'Duration (AI extracted from PDF)' : 'Employment Period',
          details: isPdfForAI ? [
            'AI will extract precise work details from PDF',
            'All achievements and responsibilities preserved',
            'Technical skills and tools mentioned exactly as written'
          ] : [
            'Key responsibility or achievement extracted from resume',
            'Another achievement or responsibility',
            'Technical skills and tools mentioned'
          ],
        },
      ],
      skills: isPdfForAI 
        ? ['Skills will be extracted by AI from PDF']
        : hasRealTextContent 
          ? this.extractSkillsFromContent(fileResult.content)
          : ['Skill 1', 'Skill 2', 'Skill 3', 'Technology 1', 'Technology 2'],
      contact: {
        email: isPdfForAI ? 'email@extracted.by.ai.from.pdf' : 'email@extracted.from.resume',
        phone: isPdfForAI ? 'phone-extracted-by-ai' : 'phone-from-resume',
        location: isPdfForAI ? 'location-extracted-by-ai' : 'Location from resume',
      },
      education: [
        {
          degree: isPdfForAI ? 'Degree (AI extracted from PDF)' : 'Degree Name',
          institution: isPdfForAI ? 'Institution (AI extracted from PDF)' : 'Institution Name',
          duration: isPdfForAI ? 'Period (AI extracted from PDF)' : 'Study Period',
        },
      ],
      metadata: {
        source: 'generator',
        lastUpdated: new Date().toISOString(),
        version: isPdfForAI ? 'PDF ready for direct AI processing with Gemini Flash Pro' : 'Text content processed',
      },
    };
  }

  private extractSkillsFromContent(content: string): string[] {
    // Simple skill extraction for demonstration
    const commonSkills = [
      'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'HTML', 'CSS',
      'SQL', 'Git', 'AWS', 'Docker', 'API', 'REST', 'GraphQL', 'MongoDB',
      'PostgreSQL', 'Linux', 'Agile', 'Scrum', 'Leadership', 'Communication'
    ];

    const foundSkills = commonSkills.filter(skill => 
      content.toLowerCase().includes(skill.toLowerCase())
    );

    return foundSkills.length > 0 ? foundSkills.slice(0, 10) : ['Skills extracted from resume'];
  }

  private buildPrecisionPrompt(fileResult: FileParseResult): string {
    return getPrecisionExtractionPrompt(fileResult.content, fileResult.fileType);
  }

  private calculateConfidence(parsed: ParsedResumeSchema): number {
    let score = 0;
    let maxScore = 0;

    // Name and title are critical
    if (parsed.name && !parsed.name.includes('Placeholder')) {
      score += 0.25;
    }
    maxScore += 0.25;

    if (parsed.title && !parsed.title.includes('Placeholder')) {
      score += 0.25;
    }
    maxScore += 0.25;

    // Experience completeness
    if (parsed.experience && parsed.experience.length > 0) {
      const expScore = parsed.experience.reduce((acc, exp) => {
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
    if (customization.profileImage && customization.profileImage.trim() !== '') {
      customizedResume.profileImage = customization.profileImage;
      console.log('[Generator] Applied profile image to resume');
    }

    // Apply custom colors if provided
    if (customization.customColors && Object.keys(customization.customColors).length > 0) {
      customizedResume.customColors = customization.customColors;
      console.log('[Generator] Applied custom colors to resume:', Object.keys(customization.customColors));
    }

    return customizedResume;
  }
}

export const generatorProcessor = new GeneratorProcessor(); 