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

class GeneratorProcessor {
  async process(fileResult: FileParseResult): Promise<ProcessingResult> {
    const startTime = Date.now();
    
    // Build precision-focused prompt
    const prompt = this.buildPrecisionPrompt(fileResult);
    console.log('Generator using precision extraction for:', fileResult.fileName);

    // TODO: Implement the actual AI call with the precision prompt
    // For now, using placeholder with more realistic structure
    const parsed: ParsedResumeSchema = {
      name: `Extracted from ${fileResult.fileName}`,
      title: 'Software Engineer', // Placeholder - would be extracted precisely
      summary: 'Precisely extracted summary maintaining original wording...',
      experience: [
        {
          title: 'Senior Developer',
          company: 'Tech Company',
          role: 'Senior Developer',
          duration: 'Jan 2020 - Present',
          details: ['Extracted bullet point 1', 'Extracted bullet point 2'],
        },
      ],
      skills: ['JavaScript', 'React', 'Node.js'], // Extracted exactly as listed
      contact: {
        email: 'extracted@email.com',
        phone: '+1-555-0123',
        location: 'City, State',
      },
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University Name',
          duration: '2016-2020',
        },
      ],
    };

    const processingTime = Date.now() - startTime;
    const confidence = this.calculateConfidence(parsed);

    return {
      data: parsed,
      meta: {
        method: 'precise-extraction',
        confidence,
        processingType: 'generator',
        fileType: fileResult.fileType,
        processingTime,
      },
    };
  }

  private buildPrecisionPrompt(fileResult: FileParseResult): string {
    return getPrecisionExtractionPrompt(fileResult.content, fileResult.fileType);
  }

  private calculateConfidence(parsed: ParsedResumeSchema): number {
    let score = 0;
    let maxScore = 0;

    // Name and title are critical
    if (parsed.name && parsed.name !== 'Placeholder Name') {
      score += 0.25;
    }
    maxScore += 0.25;

    if (parsed.title && parsed.title !== 'Placeholder Title') {
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
}

export const generatorProcessor = new GeneratorProcessor(); 