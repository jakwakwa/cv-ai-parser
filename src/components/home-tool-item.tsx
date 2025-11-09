import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/ui-button/button"
import styles from "./home-tool-item.module.css"

interface HomeToolItemContent {
    title: string
    description: string
}

interface HomeToolItemProps {
    content: HomeToolItemContent
    link: string
}

function HomeToolItem({ content, link }: HomeToolItemProps) {
    const router = useRouter()
    return (
        <section className={styles.features}>
            <div className={styles.featuresGrid}>
                {/* Resume Tailor Card */}
                <div className={styles.featureCard}>
                    <h3 className={styles.featureTitle}>{content.title}</h3>
                    <p className={styles.featureDescription}>{content.description}</p>

                    <Button variant="primary" className={styles.featureButton} onClick={() => router.push(`${link}`)}>
                        Start Building For Free
                        <ArrowRight size={16} />
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default HomeToolItem
