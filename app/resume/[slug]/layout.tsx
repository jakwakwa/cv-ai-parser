import { SiteHeader } from "@/src/components/site-header/site-header"
import styles from "./layout.module.css"

interface ResumeLayoutProps {
	children: React.ReactNode
}

export default function ResumeLayout({ children }: ResumeLayoutProps) {
	return (
		<div className={styles.pageWrapper}>
			<SiteHeader />
			<main className={styles.mainUserContainer}>{children}</main>
		</div>
	)
}
