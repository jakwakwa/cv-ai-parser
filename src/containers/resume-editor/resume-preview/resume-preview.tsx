import type { ParsedResumeSchema } from "@/lib/tools-lib/shared-parsed-resume-schema"
import ResumeDisplay from "../../resume-display/resume-display"
import styles from "./resume-preview.module.css"

interface ResumePreviewProps {
	resumeData: ParsedResumeSchema
}

const ResumePreview = ({ resumeData }: ResumePreviewProps) => {
	const enhancedData: ParsedResumeSchema = {
		...resumeData,
		experience: (resumeData.experience || []).map(exp => ({
			...exp,
			details: (exp.details || []).filter((d): d is string => !!d),
		})),
		customColors: resumeData.customColors || {},
	}

	return (
		<div className={styles.previewContainer}>
			<ResumeDisplay resumeData={enhancedData} isAuth={false} />
		</div>
	)
}

export default ResumePreview
