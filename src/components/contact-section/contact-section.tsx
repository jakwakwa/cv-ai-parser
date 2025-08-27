
//@ts-nocheck
import { MapIcon } from "lucide-react"
import { ContactTitleIcon, GitHubIcon, GlobeIcon, LinkedInIcon, MailIcon, PhoneIcon } from "../resume-display-icons"
import styles from "./contact-section.module.css"

interface Contact {
	email?: string
	phone?: string
	location?: string
	website?: string
	github?: string
	linkedin?: string
}

interface ContactSectionProps {
	contact: Contact
	customColors: Record<string, string>
}

const ContactSection = ({ contact, customColors }: ContactSectionProps) => (
	<section className={styles.contactSection}>
		<h2 className={styles.sectionTitle}>
			<ContactTitleIcon className={styles.mainIcon} />
			Contact
		</h2>
		<div className={styles.contactDetails}>
			{contact.email && (
				<div className={styles.detail}>
					<MailIcon className={styles.icon} />
					<a href={`mailto:${contact.email}`} className={styles.link}>
						{contact.email}
					</a>
				</div>
			)}
			{contact.phone && (
				<div className={styles.detail}>
					<PhoneIcon className={styles.icon} />
					<span className={styles.text} style={{ color: customColors["--resume-body-text"] }}>
						{contact.phone}
					</span>
				</div>
			)}
			{contact.location && (
				<div className={styles.detail}>
					<MapIcon className={styles.icon} />
					<span className={styles.text} style={{ color: customColors["--resume-body-text"] }}>
						{contact.location}
					</span>
				</div>
			)}
			{contact.linkedin && (
				<div className={styles.detail}>
					<LinkedInIcon className={styles.icon} />
					<a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={styles.link}>
						LinkedIn
					</a>
				</div>
			)}
			{contact.github && (
				<div className={styles.detail}>
					<GitHubIcon className={styles.icon} />
					<a href={contact.github} target="_blank" rel="noopener noreferrer" className={styles.link} style={{ color: customColors["--resume-body-text"] }}>
						GitHub
					</a>
				</div>
			)}
			{contact.website && (
				<div className={styles.detail}>
					<GlobeIcon className={styles.icon} />
					<a href={contact.website} target="_blank" rel="noopener noreferrer" className={styles.link} style={{ color: customColors["--resume-body-text"] }}>
						Website
					</a>
				</div>
			)}
		</div>
	</section>
)

export default ContactSection
