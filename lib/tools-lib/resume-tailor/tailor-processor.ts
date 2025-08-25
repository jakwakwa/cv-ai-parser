import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import type { FileParseResult } from '../shared/file-parsers/base-parser';
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

class TailorProcessor {
  async process(
    fileResult: FileParseResult,
    tailorContext: TailorContext,
    customization?: CustomizationOptions
  ): Promise<ProcessingResult> {
    const startTime = Date.now();
    console.log('Tailor processing for:', fileResult.fileName);

    // Step 1: Parse original resume with precision
    const originalParsed = await this.parseOriginal(fileResult.content);

    // Step 2: Analyze job specification
    const jobAnalysis = await this.analyzeJobSpec(tailorContext.jobSpecText || '');

    // Step 3: Apply tailoring based on job spec and tone
    const tailored = await this.applyTailoring(originalParsed, tailorContext, fileResult.fileData);

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

  private async parseOriginal(content: string): Promise<ParsedResumeSchema> {
    // TODO: Implement actual AI call using getOriginalResumeParsingPrompt
    const prompt = getOriginalResumeParsingPrompt(content);
    console.log('[Tailor] Parsing original resume for tailoring...');
    
    // Check if this is a PDF that should be sent directly to AI
    const isPdfForAI = content.startsWith('PDF_FILE_FOR_AI_PROCESSING');
    const hasRealTextContent = !content.includes('Placeholder content') && 
                              !isPdfForAI && 
                              content.length > 100;
    
    if (isPdfForAI) {
      console.log('[Tailor] PDF detected - ready for direct AI processing with Gemini Flash Pro');
      
      const fileInfo = content.split(':');
      const fileName = fileInfo[1] || 'Resume.pdf';
      
      return {
        name: fileName.replace(/\.(pdf)$/i, '').replace(/[_-]/g, ' '),
        title: 'Professional Title (AI will extract from PDF)',
        summary: `PDF Resume ready for AI tailoring with Gemini Flash Pro.
        
⚡ Advanced Processing Capabilities:
• Direct PDF object parsing (no text extraction needed)
• Precise content extraction maintaining original formatting  
• Job-specific optimization while preserving factual accuracy
• ATS-compatible output generation

[In production: PDF + Job Spec → AI → Tailored Resume]`,
        experience: [
          {
            title: 'Position (AI will extract and optimize from PDF)',
            company: 'Company (AI will extract from PDF)',
            role: 'Role (AI will extract from PDF)', 
            duration: 'Duration (AI will extract from PDF)',
            details: [
              'AI will extract original achievements from PDF',
              'Content will be optimized for job requirements',
              'Keywords will be naturally integrated'
            ],
          },
        ],
        skills: ['Skills will be extracted and optimized by AI from PDF'],
        contact: {
          email: 'email@extracted.by.ai.from.pdf',
          phone: 'phone-extracted-by-ai',
          location: 'location-extracted-by-ai',
        },
        education: [
          {
            degree: 'Degree (AI will extract from PDF)',
            institution: 'Institution (AI will extract from PDF)',
            duration: 'Period (AI will extract from PDF)',
          },
        ],
      };
    }
    
    if (hasRealTextContent) {
      console.log('[Tailor] Working with real text content, length:', content.length);
      
      // Extract name from content if possible
      const nameMatch = content.match(/(?:Name|My name is|I am|I'm)\s*:?\s*([A-Za-z\s]+)/i);
      const extractedName = nameMatch ? nameMatch[1].trim() : 'Resume Candidate';
      
      return {
        name: extractedName,
        title: 'Professional Title (from original resume)',
        summary: `Original resume content preview: ${content.substring(0, 200)}...`,
        experience: [
          {
            title: 'Position (extracted from original)',
            company: 'Company (extracted from original)',
            role: 'Role (extracted from original)',
            duration: 'Duration (extracted from original)',
            details: [
              'Original responsibility/achievement from resume',
              'Original technical contribution from resume',
              'Original impact/result from resume'
            ],
          },
        ],
        skills: this.extractSkillsFromContent(content),
        contact: {
          email: 'email@from.original.resume',
          phone: 'phone-from-original',
          location: 'location-from-original',
        },
        education: [
          {
            degree: 'Degree (from original resume)',
            institution: 'Institution (from original resume)',
            duration: 'Study period (from original)',
          },
        ],
      };
    }
    
    // Fallback placeholder for other cases
    return {
      name: 'John Doe',
      title: 'Software Developer',
      summary: content.substring(0, 200) + '...',
      experience: [
        {
          title: 'Software Developer',
          company: 'Current Company',
          role: 'Software Developer',
          duration: 'Jan 2021 - Present',
          details: [
            'Developed web applications using modern frameworks',
            'Collaborated with cross-functional teams',
            'Implemented best practices for code quality'
          ],
        },
      ],
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
      contact: {
        email: 'john.doe@email.com',
        phone: '+1-555-0123',
        location: 'City, State',
      },
      education: [
        {
          degree: 'Bachelor of Computer Science',
          institution: 'University',
          duration: '2017-2021',
        },
      ],
    };
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

  private async analyzeJobSpec(jobSpec: string): Promise<any> {
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
    context: TailorContext,
    fileData?: ArrayBuffer
  ): Promise<ParsedResumeSchema> {
    if (fileData) {
      const model = google('gemini-1.5-flash');
      const prompt = getTailoredResumeParsingPrompt(
        'PDF_FILE_FOR_AI_PROCESSING',
        context.jobSpecText || '',
        context.tone
      );
      const { text } = await generateText({
        model,
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'file', data: new Uint8Array(fileData) },
          ],
        }],
      });
      // Strip markdown code block and any extra content after JSON
      let cleanText = text.trim();
      // Remove code block markers if present
      if (cleanText.startsWith('```json')) {
        cleanText = cleanText.replace(/^```json\s*/, '');
      }
      if (cleanText.endsWith('```')) {
        cleanText = cleanText.replace(/```\s*$/, '');
      }
      // Extract only the first valid JSON object (in case of extra content)
      const firstBrace = cleanText.indexOf('{');
      const lastBrace = cleanText.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanText = cleanText.substring(firstBrace, lastBrace + 1);
      }
      return JSON.parse(cleanText) as ParsedResumeSchema;
    }
    // TODO: Implement the main AI call using getTailoredResumeParsingPrompt
    const prompt = getTailoredResumeParsingPrompt(
      JSON.stringify(original, null, 2),
      context.jobSpecText || '',
      context.tone
    );
    
    console.log('Applying tailoring with tone:', context.tone);
    
    const strategy = getTailoringStrategy(context.tone);
    
    // Enhanced placeholder tailoring
    const commentary = this.generateTailoringCommentary(original, context, strategy);
    
    return {
      ...original,
      title: this.optimizeTitle(original.title, context),
      summary: this.optimizeSummary(original.summary || '', context, strategy),
      experience: this.optimizeExperience(original.experience, context),
      skills: this.optimizeSkills(original.skills || [], context),
      metadata: {
        aiTailorCommentary: commentary,
        lastUpdated: new Date().toISOString(),
        source: 'tailored',
      },
    };
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