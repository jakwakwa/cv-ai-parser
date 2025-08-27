/** biome-ignore-all lint/a11y/noStaticElementInteractions: <a11y is okay for this button> */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: <a11y is okay for this> */
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import {
	AlertTriangle,
	FileText,
	Upload as FileUpIcon,
	Palette,
	Upload,
	//@ts-ignore
	Wand,
} from "lucide-react"
import ColorPickerDialog from "@/src/components/color-picker/color-picker-dialog/color-picker-dialog"
import { Button } from "@/src/components/ui/ui-button/button"
import ProfileImageUploader from "@/src/containers/profile-image-uploader/profile-image-uploader"
import styles from "../containers/tool-containers/shared-tool.module.css"
import type { ResumeGeneratorState, ResumeTailorState } from "../containers/tool-containers/types"

interface ResumeUploadPanelProps {
	state: ResumeTailorState | ResumeGeneratorState
	fileInputRef: React.RefObject<HTMLInputElement | null>
	onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onRemoveFile: () => void
	onDrag: (e: React.DragEvent<HTMLDivElement>) => void
	onDrop: (e: React.DragEvent<HTMLDivElement>) => void
	onProfileImageChange: (imageUrl: string) => void
	onColorsChange: (colors: Record<string, string>) => void
	onShowColorDialog: () => void
	onHideColorDialog: () => void
	onCreateResume: () => void
	isLoading: boolean
	hideSubmitButton?: boolean
}

export function ResumeUploadPanel({
	state,
	fileInputRef,
	onFileChange,
	onRemoveFile,
	onDrag,
	onDrop,
	onProfileImageChange,
	onColorsChange,
	onShowColorDialog,
	onHideColorDialog,
	onCreateResume,
	isLoading,
	hideSubmitButton,
}: ResumeUploadPanelProps) {
	return (
		<div className={styles.panel}>
			<div className={styles.panelHeader}>
				<FileText className={styles.panelIcon} />
				<h2 className={styles.panelTitle}>Your Resume</h2>
			</div>

			<div className={styles.dropZone} onDrag={onDrag} onDragLeave={onDrag} onDragOver={onDrag} onDrop={onDrop} onClick={() => fileInputRef.current?.click()}>
				<VisuallyHidden.Root>
					<label htmlFor="resume-upload">Upload your resume</label>
				</VisuallyHidden.Root>
				<input id="resume-upload" type="file" ref={fileInputRef} onChange={onFileChange} className={styles.fileInput} accept=".pdf" />

				{state.uploadedFile ? (
					<div className={styles.fileSelected}>
						<FileUpIcon size={32} className={styles.uploadIcon} />
						<p className={styles.fileName}>{state.uploadedFile.name}</p>
						<p className={styles.fileSize}>{(state.uploadedFile.size / 1024).toFixed(1)} KB</p>
						<Button variant="outline" size="sm" onClick={onRemoveFile} className={styles.changeFileButton}>
							Change File
						</Button>
					</div>
				) : (
					<div className={styles.dropZoneContent}>
						<Upload size={40} className={styles.uploadIcon} />
						<p className={styles.dropText}>Drag & drop your resume here</p>
						<p className={styles.dropSubtext}>or click to browse</p>
						<span className={styles.fileTypes}>Supports PDF files (Max 10MB)</span>
					</div>
				)}
			</div>

			<div className={styles.customizationSection}>
				<h3 className={styles.sectionTitle}>Profile Picture (Optional)</h3>
				<ProfileImageUploader onImageChange={onProfileImageChange} showPrompt={false} />
			</div>

			<div className={styles.customizationSection}>
				<ColorPickerDialog open={state.showColorDialog} onOpenChange={onHideColorDialog} currentColors={state.customColors} onColorsChange={onColorsChange} />
				<button type="button" onClick={onShowColorDialog} className={styles.colorButton}>
					<Palette size={20} />
					Customize Colors
				</button>

				<div className={styles.actionSection}>
					{state.error && (
						<div className={styles.errorMessage}>
							<AlertTriangle size={16} />
							{state.error}
						</div>
					)}

					{!hideSubmitButton && (
						<Button onClick={onCreateResume} disabled={isLoading || !state.uploadedFile} className={styles.createButton} variant="primary" size="lg">
							<Wand size={20} />
							Create Resume
						</Button>
					)}
				</div>
			</div>
		</div>
	)
}
