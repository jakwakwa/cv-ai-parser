import type { FileParseResult } from "./base-parser"
import { PdfParser } from "./pdf-parser"
import { TxtParser } from "./txt-parser"

export class FileProcessor {
	private pdfParser = new PdfParser()
	private txtParser = new TxtParser()

	async processFile(file: File): Promise<FileParseResult> {
		try {
			switch (file.type) {
				case "application/pdf":
					return await this.pdfParser.parse(file)

				case "text/plain":
					return await this.txtParser.parse(file)

				default:
					throw new Error(`Unsupported file type: ${file.type}. Please upload a PDF or TXT file.`)
			}
		} catch (error) {
			if (error instanceof Error) {
				throw error
			}
			throw new Error("Failed to process file. Please try again with a different file.")
		}
	}

	getSupportedFileTypes(): string[] {
		return ["application/pdf", "text/plain"]
	}

	isFileTypeSupported(fileType: string): boolean {
		return this.getSupportedFileTypes().includes(fileType)
	}

	getMaxFileSize(): number {
		return 10 * 1024 * 1024 // 10MB
	}

	validateFileSize(file: File): void {
		if (file.size > this.getMaxFileSize()) {
			throw new Error(`File size (${Math.round(file.size / 1024 / 1024)}MB) exceeds the maximum limit of 10MB.`)
		}
	}

	async validateAndProcessFile(file: File): Promise<FileParseResult> {
		// Validate file size
		this.validateFileSize(file)

		// Validate file type
		if (!this.isFileTypeSupported(file.type)) {
			throw new Error(`Unsupported file type: ${file.type}. Please upload a PDF or TXT file.`)
		}

		// Process the file
		return await this.processFile(file)
	}
}

// Export singleton instance
export const fileProcessor = new FileProcessor()
