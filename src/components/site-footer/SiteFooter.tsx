import Link from "next/link"
import styles from "./SiteFooter.module.css"

export function SiteFooter() {
    return (
        <footer className={styles.footer}>
            <nav className={styles.nav}>
                <Link href="/privacy-policy" className={styles.link}>
                    Privacy Policy
                </Link>
                <Link href="/terms-and-conditions" className={styles.link}>
                    Terms and Conditions
                </Link>
                <Link href="/resources" className={styles.link}>
                    Docs
                </Link>
            </nav>
        </footer>
    )
}
