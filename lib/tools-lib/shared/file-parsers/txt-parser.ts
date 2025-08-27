import { BaseFileParser, FileParseResult } from './base-parser';

export class TxtParser extends BaseFileParser {
  async parse(file: File): Promise<FileParseResult> {
    this.validateFile(file, ['text/plain']);

    try {
      // Read text content directly from the file
      const content = await file.text();

      return {
        content,
        fileType: 'txt',
        fileName: file.name,
        fileSize: file.size,
      };
    } catch (error) {
      throw new Error(
        `Failed to parse TXT file: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
