export interface FileParseResult {
  content: string;
  fileType: 'pdf' | 'txt' | 'docx';
  fileName: string;
  fileSize: number;
  fileData?: ArrayBuffer; // For AI SDK PDF processing
}

export abstract class BaseFileParser {
  abstract parse(file: File): Promise<FileParseResult>;

  protected validateFile(file: File, allowedTypes: string[]): void {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
  }
} 