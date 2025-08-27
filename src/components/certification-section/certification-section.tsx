import { CertificationsIcon } from "../resume-display-icons"
import styles from "./certification-section.module.css"

interface CertificationItem {
	name: string
	issuer: string
	date?: string
	id?: string
}

interface CertificationsSectionProps {
	certifications?: CertificationItem[]
	customColors: Record<string, string>
}

const CertificationsSection = ({ certifications, customColors }: CertificationsSectionProps) => {
	// const colors = customColors || {};

	return (
		<section className={styles.certificationsSection}>
			<h2 className={styles.sectionTitle} style={{ color: customColors["--resume-section-titles"] }}>
				<CertificationsIcon className="mainIcon" />
				Certifications
			</h2>
			{certifications && certifications.length > 0 ? (
				<div className={styles.certificationsList}>
					{certifications.map(cert => (
						<div key={cert.id || cert.name} className={styles.certificationItem}>
							<p className="subject" style={{ color: customColors["--resume-job-title"] }}>
								{cert.name}
							</p>
							<p className="issuer" style={{ color: customColors["--resume-main-icons"] }}>
								{cert.issuer}
							</p>
							{cert.date && (
								<p className="text-slate-500 text-[0.52rem] font-medium" >
									{cert.date}
								</p>
							)}
							{cert.id && (
								<p className={styles.credentialId} style={{ color: customColors["--resume-body-text"] }}>
									ID: {cert.id}
								</p>
							)}
						</div>
					))}
				</div>
			) : (
				<p className={styles.noCerts} style={{ color: customColors["--resume-body-text"] }}>
					No certifications listed.
				</p>
			)}
		</section>
	)
}

export default CertificationsSection
