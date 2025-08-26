import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { AI_MODEL_PRO } from '@/lib/config';
import type { FileParseResult } from '../shared/file-parsers/base-parser';
import { parsedResumeSchema } from '../shared-parsed-resume-schema';
import type { ParsedResumeSchema } from '../shared-parsed-resume-schema';
import {
  getJobSpecAnalysisPrompt,
  getOriginalResumeParsingPrompt,
  getTailoredResumeParsingPrompt,
  getTailoringStrategy,
  TAILOR_CONFIG
} from './tailor-prompts';
import type { UserAdditionalContext } from './tailor-schema';

// This will be expanded with more metadata later
interface ProcessingResult {
  data: ParsedResumeSchema;
  meta: {
    method: string;
    confidence: number;
    processingType: 'tailor';
    aiTailorCommentary?: string;
    jobMatchScore?: number;
    optimizationLevel?: string;
    processingTime?: number;
  };
}

interface CustomizationOptions {
  profileImage?: string;
  customColors?: Record<string, string>;
}

// Placeholder for the full context needed for tailoring
type TailorContext = UserAdditionalContext;

// Local helper types
type ModelMessage = {
  type: 'file' | 'text';
  data?: Uint8Array;
  mimeType?: string;
  text?: string;
};

type JobAnalysis = {
  keywords: string[];
  requirements: string[];
  skills: string[];
};

class TailorProcessor {
  private stripCodeFences(raw: string): string {
    let text = raw.trim();
    // Remove triple backtick fences if present
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\s*/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\s*/, '');
    }
    if (text.endsWith('```')) {
      text = text.replace(/```\s*$/, '');
    }
    return text;
  }

  // Extract the first balanced JSON object from the text
  private extractBalancedJsonObject(text: string): string | null {
    const start = text.indexOf('{');
    if (start === -1) return null;
    let depth = 0;
    let inString = false;
    let isEscaped = false;
    for (let i = start; i < text.length; i++) {
      const ch = text[i];
      if (inString) {
        if (isEscaped) {
          isEscaped = false;
        } else if (ch === '\\') {
          isEscaped = true;
        } else if (ch === '"') {
          inString = false;
        }
        continue;
      }
      if (ch === '"') {
        inString = true;
        continue;
      }
      if (ch === '{') depth++;
      if (ch === '}') depth--;
      if (depth === 0) {
        return text.substring(start, i + 1);
      }
    }
    return null;
  }

  private removeTrailingCommas(jsonText: string): string {
    // Remove dangling commas before } or ]
    return jsonText.replace(/,(\s*[}\]])/g, '$1');
  }

  private cleanJson(raw: string): string {
    // Normalize unicode spaces and remove zero-width characters
    let text = raw.replace(/[\u200B-\u200D\uFEFF]/g, '');
    text = this.stripCodeFences(text);
    const balanced = this.extractBalancedJsonObject(text);
    text = balanced ?? text;
    text = this.removeTrailingCommas(text);
    return text.trim();
  }

  private parseResumeJsonOrThrow(raw: string): ParsedResumeSchema {
    const cleaned = this.cleanJson(raw);
    try {
      const parsed = JSON.parse(cleaned);
      const result = parsedResumeSchema.parse(parsed);
      return result;
    } catch (err) {
      console.error('[Tailor] Failed to parse AI JSON. Cleaned snippet:', cleaned.slice(0, 600));
      throw new Error('AI returned invalid JSON. Please try again with a simpler file or job spec.');
    }
  }

  async process(
    fileResult: FileParseResult,
    tailorContext: TailorContext,
    customization?: CustomizationOptions
  ): Promise<ProcessingResult> {
    const startTime = Date.now();
    console.log('Tailor processing for:', fileResult.fileName);

    // Step 1: Parse original resume with precision
    const originalParsed = await this.parseOriginal(fileResult);

    // Step 2: Analyze job specification
    const jobAnalysis = await this.analyzeJobSpec(tailorContext.jobSpecText || '');

    // Step 3: Apply tailoring based on job spec and tone
    const tailored = await this.applyTailoring(originalParsed, tailorContext);

    // Step 4: Apply customizations (profile image and colors)
    const customizedResume = this.applyCustomizations(tailored, customization);

    const processingTime = Date.now() - startTime;
    const matchScore = this.calculateJobMatchScore(customizedResume, tailorContext);
    const strategy = getTailoringStrategy(tailorContext.tone);

    return {
      data: customizedResume,
      meta: {
        method: 'job-tailored',
        confidence: this.calculateTailoringMatch(customizedResume, tailorContext),
        processingType: 'tailor',
        aiTailorCommentary: customizedResume.metadata?.aiTailorCommentary,
        jobMatchScore: matchScore,
        optimizationLevel: strategy.keywordDensity,
        processingTime,
      },
    };
  }

  private async parseOriginal(fileResult: FileParseResult): Promise<ParsedResumeSchema> {
    const model = google(AI_MODEL_PRO);
    const messagesContent: ModelMessage[] = [];

    if (fileResult.fileType === 'pdf' && fileResult.fileData) {
      messagesContent.push({
        type: 'file',
        data: new Uint8Array(fileResult.fileData),
        mimeType: 'application/pdf',
      });
      messagesContent.push({
        type: 'text',
        text: getOriginalResumeParsingPrompt(''), // Prompt instructions
      });
    } else {
      messagesContent.push({
        type: 'text',
        text: getOriginalResumeParsingPrompt(fileResult.content),
      });
    }

    console.log('[Tailor] Parsing original resume for tailoring...');

    const { text } = await generateText({
      model,
      messages: [
        {
          role: 'user',
          content: messagesContent as any,
        },
      ],
      temperature: 0.2,
    });

    return this.parseResumeJsonOrThrow(text);
  }

  private extractSkillsFromContent(content: string): string[] {
    // Simple skill extraction for demonstration
    const commonSkills = [
      'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'HTML', 'CSS',
      'SQL', 'Git', 'AWS', 'Docker', 'API', 'REST', 'GraphQL', 'MongoDB',
      'PostgreSQL', 'Linux', 'Agile', 'Scrum', 'Leadership', 'Communication',
      'Vue', 'Angular', 'Express', 'Django', 'Flask', 'Spring', 'Java', 'C#',
      'PHP', 'Ruby', 'Go', 'Rust', 'Kubernetes', 'Jenkins', 'CI/CD'
    ];

    const foundSkills = commonSkills.filter(skill =>
      content.toLowerCase().includes(skill.toLowerCase())
    );

    return foundSkills.length > 0 ? foundSkills.slice(0, 15) : ['Skills from original resume'];
  }

  private async analyzeJobSpec(jobSpec: string): Promise<JobAnalysis> {
    if (!jobSpec.trim()) {
      return { keywords: [], requirements: [], skills: [] };
    }

    // TODO: Implement actual AI call using getJobSpecAnalysisPrompt
    const prompt = getJobSpecAnalysisPrompt(jobSpec);
    console.log('Analyzing job specification...');
    
    // Placeholder analysis
    return {
      keywords: ['React', 'JavaScript', 'API', 'TeamWork'],
      requirements: ['3+ years experience', 'Bachelor\'s degree'],
      skills: ['React', 'Node.js', 'REST APIs', 'Agile'],
    };
  }

  private async applyTailoring(
    original: ParsedResumeSchema,
    context: TailorContext
  ): Promise<ParsedResumeSchema> {
    const model = google(AI_MODEL_PRO);
    const prompt = getTailoredResumeParsingPrompt(
      JSON.stringify(original, null, 2),
      context.jobSpecText || '',
      context.tone
    );

    console.log('Applying tailoring with tone:', context.tone);

    const { text } = await generateText({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.2,
    });

    return this.parseResumeJsonOrThrow(text);
  }

  private applyCustomizations(resume: ParsedResumeSchema, customization?: CustomizationOptions): ParsedResumeSchema {
    if (!customization) return resume;

    const customizedResume = { ...resume };

    // Apply profile image if provided and not empty
    if (customization.profileImage && customization.profileImage.trim() !== '') {
      customizedResume.profileImage = customization.profileImage;
      console.log('[Tailor] Applied profile image to resume');
    }

    // Apply custom colors if provided
    if (customization.customColors && Object.keys(customization.customColors).length > 0) {
      customizedResume.customColors = customization.customColors;
      console.log('[Tailor] Applied custom colors to resume:', Object.keys(customization.customColors));
    }

    return customizedResume;
  }

  private optimizeTitle(originalTitle: string, context: TailorContext): string {
    // Extract potential role from job spec
    const jobSpecText = context.jobSpecText || '';
    if (jobSpecText.toLowerCase().includes('senior')) {
      return `Senior ${originalTitle}`;
    }
    if (jobSpecText.toLowerCase().includes('lead')) {
      return `Lead ${originalTitle}`;
    }
    return originalTitle;
  }

  private optimizeSummary(originalSummary: string, context: TailorContext, strategy: any): string {
    const baseText = originalSummary || 'Professional with proven experience in software development.';
    return `${baseText} Specializing in areas relevant to ${context.jobSpecText?.substring(0, 50)}... with ${strategy.language} approach.`;
  }

  private optimizeExperience(experience: any[], context: TailorContext): any[] {
    return experience.map(exp => ({
      ...exp,
      details: exp.details?.map((detail: string) =>
        detail.includes('web') ? `${detail} (optimized for role requirements)` : detail
      ) || [],
    }));
  }

  private optimizeSkills(skills: string[], context: TailorContext): string[] {
    const jobKeywords = this.extractKeywordsFromJobSpec(context.jobSpecText || '');
    const relevantSkills = skills.filter(skill =>
      jobKeywords.some(keyword =>
        skill.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    // Prioritize relevant skills and add any missing critical ones
    return [...new Set([...relevantSkills, ...skills])];
  }

  private extractKeywordsFromJobSpec(jobSpec: string): string[] {
    // Simple keyword extraction - would be enhanced with AI analysis
    const commonTechWords = ['JavaScript', 'React', 'Node', 'Python', 'AWS', 'API', 'Database'];
    return commonTechWords.filter(word =>
      jobSpec.toLowerCase().includes(word.toLowerCase())
    );
  }

  private generateTailoringCommentary(
    original: ParsedResumeSchema,
    context: TailorContext,
    strategy: any
  ): string {
    const roleHint = context.jobSpecText?.substring(0, 100) || 'the target position';
    return `This resume was strategically tailored for ${roleHint}. Key optimizations included:
    1. Adjusted tone to ${context.tone.toLowerCase()} style using ${strategy.language}
    2. Highlighted relevant experience and skills that match job requirements
    3. Optimized keyword density for ATS compatibility
    4. Reordered content to emphasize most relevant qualifications
    
    The candidate's background in ${original.experience?.[0]?.title || 'their field'} aligns well with the position requirements, with particular strength in technical skills and proven experience.`;
  }

  private calculateJobMatchScore(tailored: ParsedResumeSchema, context: TailorContext): number {
    let score = 0;
    const jobSpec = context.jobSpecText?.toLowerCase() || '';
    
    // Check skill alignment
    const relevantSkills = tailored.skills?.filter(skill =>
      jobSpec.includes(skill.toLowerCase())
    ) || [];
    score += (relevantSkills.length / Math.max(tailored.skills?.length || 1, 1)) * 0.4;
    
    // Check experience relevance
    const relevantExp = tailored.experience?.filter(exp =>
      exp.details?.some(detail =>
        detail && jobSpec.split(' ').some(word =>
          detail.toLowerCase().includes(word.toLowerCase()) && word.length > 3
        )
      )
    ) || [];
    score += (relevantExp.length / Math.max(tailored.experience?.length || 1, 1)) * 0.4;
    
    // Check title alignment
    if (jobSpec.includes(tailored.title.toLowerCase())) {
      score += 0.2;
    }
    
    return Math.min(score, 1.0);
  }

  private calculateTailoringMatch(
    tailored: ParsedResumeSchema,
    context: TailorContext
  ): number {
    let score = 0;
    
    // Base score for having tailored content
    if (tailored.metadata?.aiTailorCommentary) score += 0.3;
    
    // Score for job spec utilization
    if (context.jobSpecText && context.jobSpecText.length > 50) score += 0.3;
    
    // Score for tone application
    if (context.tone && context.tone !== 'Neutral') score += 0.2;
    
    // Score for data completeness
    if (tailored.skills && tailored.skills.length > 0) score += 0.1;
    if (tailored.experience && tailored.experience.length > 0) score += 0.1;
    
    return Math.min(score, 1.0);
  }
}

export const tailorProcessor = new TailorProcessor(); 