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

// Placeholder for the full context needed for tailoring
type TailorContext = UserAdditionalContext;

class TailorProcessor {
  async process(
    fileResult: FileParseResult,
    tailorContext: TailorContext
  ): Promise<ProcessingResult> {
    const startTime = Date.now();
    console.log('Tailor processing for:', fileResult.fileName);

    // Step 1: Parse original resume with precision
    const originalParsed = await this.parseOriginal(fileResult.content);

    // Step 2: Analyze job specification
    const jobAnalysis = await this.analyzeJobSpec(tailorContext.jobSpecText || '');

    // Step 3: Apply tailoring based on job spec and tone
    const tailored = await this.applyTailoring(originalParsed, tailorContext);

    const processingTime = Date.now() - startTime;
    const matchScore = this.calculateJobMatchScore(tailored, tailorContext);
    const strategy = getTailoringStrategy(tailorContext.tone);

    return {
      data: tailored,
      meta: {
        method: 'job-tailored',
        confidence: this.calculateTailoringMatch(tailored, tailorContext),
        processingType: 'tailor',
        aiTailorCommentary: tailored.metadata?.aiTailorCommentary,
        jobMatchScore: matchScore,
        optimizationLevel: strategy.keywordDensity,
        processingTime,
      },
    };
  }

  private async parseOriginal(content: string): Promise<ParsedResumeSchema> {
    // TODO: Implement actual AI call using getOriginalResumeParsingPrompt
    const prompt = getOriginalResumeParsingPrompt(content);
    console.log('Parsing original resume for tailoring...');
    
    // Placeholder - would be replaced with actual AI parsing
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
    context: TailorContext
  ): Promise<ParsedResumeSchema> {
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
        jobSpec.split(' ').some(word => 
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