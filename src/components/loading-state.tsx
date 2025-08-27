import styles from "../containers/tool-containers/shared-tool.module.css"
import type { PartialResumeData } from "../containers/tool-containers/types"

interface LoadingStateProps {
	streamingMessage: string
	streamingProgress: number
	partialResumeData: PartialResumeData | null
}

export function LoadingState({ streamingMessage, streamingProgress, partialResumeData }: LoadingStateProps) {
	return (
		<div className={styles.loadingState}>
			<div className={styles.loadingCard}>
				<div className={styles.loadingSpinner} />
				<p className={styles.loadingTitle}>{streamingMessage || "Extracting data from your resume..."}</p>
				<p className={styles.loadingSubtitle}>{streamingProgress > 0 ? `Progress: ${streamingProgress}%` : "AI is analyzing the job specifications and tailoring your resume..."}</p>

				{streamingProgress > 0 && (
					<div className={styles.progressBar}>
						<div className={styles.progressFill} style={{ width: `${streamingProgress}%` }} />
					</div>
				)}

				{partialResumeData && (
					<div className={styles.partialPreview}>
						<p className={styles.previewTitle}>Partial Resume Data:</p>
						<div className={styles.previewContent}>
							{partialResumeData.name && (
								<p>
									<strong>Name:</strong> {partialResumeData.name}
								</p>
							)}
							{partialResumeData.title && (
								<p>
									<strong>Title:</strong> {partialResumeData.title}
								</p>
							)}
							{Array.isArray(partialResumeData.experience) && partialResumeData.experience.length > 0 && (
								<p>
									<strong>Experience sections:</strong> {partialResumeData.experience.length}
								</p>
							)}
							{Array.isArray(partialResumeData.skills) && partialResumeData.skills.length > 0 && (
								<p>
									<strong>Skills found:</strong> {partialResumeData.skills.length}
								</p>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
