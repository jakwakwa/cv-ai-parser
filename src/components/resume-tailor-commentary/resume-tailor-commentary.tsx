import { Card, CardContent, CardHeader } from "@/src/components/ui/card"
import styles from "./resume-tailor-commentary.module.css"
// @ts-ignore - this is expected
import { Wand, ChevronDown, ChevronUp } from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from "react"
import { Button } from "../ui/ui-button/button"

interface ResumeTailorCommentaryProps {
    aiTailorCommentary: string | null // Renamed from aiSummary
}

const ResumeTailorCommentary: React.FC<ResumeTailorCommentaryProps> = ({ aiTailorCommentary }) => {
    const [isOpen, setIsOpen] = useState(true)
    if (!aiTailorCommentary) {
        return null
    }
    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className={styles.collapsibleWrapper}>
            <Card className={styles.card}>

                <CardHeader className={styles.cardHeader}>
                    <div className={styles.cardHeaderContent} >
                        <Wand />
                        <h2 className={styles.title}>AI Insights</h2>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className={styles.toggleButton}>
                                {isOpen ? <ChevronUp /> : <ChevronDown />}
                                <span className={styles.srOnly}>Toggle</span>
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                </CardHeader>
                <CollapsibleContent className={styles.collapsibleContent}>
                    <CardContent className={styles.cardContent}>
                        <p className={styles.summaryText}>{aiTailorCommentary}</p>
                    </CardContent>
                </CollapsibleContent>

            </Card>
        </Collapsible>
    )
}

export default ResumeTailorCommentary
