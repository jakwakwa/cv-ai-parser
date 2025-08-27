"use-client"

import styles from "./profile-header.module.css"
import Image from "next/image"

interface ProfileHeaderProps {
	profileImage: string | undefined
	name: string
	title: string
	summary: string
	customColors: Record<string, string>
}

const ProfileHeader = ({ profileImage, name, title, summary, customColors }: ProfileHeaderProps) => {
	const showTitle = title && title.toLowerCase() !== "professional" && title !== summary

	// SAFE ADDITION: UI-only clamp to ensure display never exceeds 860 chars.
	// This is a non-destructive view concern; underlying data is preserved or
	// already shortened in post-processing where applicable.
	const displaySummary = (summary || "").slice(0, 860)

	// Check if we have a real profile image (not the default placeholder)
	const lowerImg = profileImage ? profileImage.toLowerCase() : ""
	const omittedProfileImage = profileImage === "omitted"
	const hasProfileImage = profileImage && lowerImg.trim() !== "" && !lowerImg.includes("placeholder") && !lowerImg.includes("placehold.co")

	return (
		<div className={`${styles.header} ${!hasProfileImage || omittedProfileImage ? styles.noImage : ""}`}>
			{/* Left: Profile Image - only show if image exists */}
			{hasProfileImage && !omittedProfileImage && (
				<div className={styles.left}>
					<div className={styles.profileImage}>
						<Image src={profileImage} alt={""} fill style={{ objectFit: "cover" }} />
					</div>
				</div>
			)}

			{/* Right: Name, Title, and Summary - spans full width when no image */}
			<div className={`${styles.right} ${!hasProfileImage ? styles.fullWidth : ""}`}>
				<h1 className={styles.cvHeader} style={{ color: customColors["--resume-profile-name"] }}>
					CURRICULUM VITAE
				</h1>
				<h2 className={styles.profileName} style={{ color: customColors["--resume-profile-name"] }}>
					{name}
				</h2>
				{showTitle && (
					<p className={styles.jobTitle} style={{ color: customColors["--resume-job-title"] }}>
						{title}
					</p>
				)}
				<section className={styles.summarySection}>
					<p className={styles.contentBody} style={{ color: customColors["--resume-body-text"] }}>
						{displaySummary}
					</p>
				</section>
			</div>
		</div>
	)
}

export default ProfileHeader
