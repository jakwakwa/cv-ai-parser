"use client"

import { Trash2 } from "lucide-react"
import { memo } from "react"
import type { ParsedResumeSchema } from "@/lib/tools-lib/shared-parsed-resume-schema"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Button } from "@/src/components/ui/ui-button/button"
import styles from "./education-item.module.css"

interface EducationItemProps {
	edu: NonNullable<ParsedResumeSchema["education"]>[number]
	index: number
	onChange: <Field extends keyof NonNullable<ParsedResumeSchema["education"]>[number]>(index: number, field: Field, value: NonNullable<ParsedResumeSchema["education"]>[number][Field]) => void
	onRemove: (index: number) => void
}

const EducationItem = memo(function EducationItem({ edu, index, onChange, onRemove }: EducationItemProps) {
	return (
		<div className={styles.educationItem}>
			<div className={styles.educationItemHeader}>
				<h3 className={styles.educationItemTitle}>Education #{index + 1}</h3>
				<Button variant="ghost" size="sm" onClick={() => onRemove(index)} className={styles.removeEducationButton}>
					<Trash2 className={styles.iconMd} />
				</Button>
			</div>
			<div className={styles.formGridFull}>
				<div className={styles.formField}>
					<Label htmlFor={`education-degree-${index}`} className={styles.label}>
						Degree
					</Label>
					<Input id={`education-degree-${index}`} value={edu.degree || ""} onChange={e => onChange(index, "degree", e.target.value)} className={styles.input} />
				</div>
				<div className={styles.formField}>
					<Label htmlFor={`education-institution-${index}`} className={styles.label}>
						Institution
					</Label>
					<Input id={`education-institution-${index}`} value={edu.institution || ""} onChange={e => onChange(index, "institution", e.target.value)} className={styles.input} />
				</div>
				<div className={styles.formField}>
					<Label htmlFor={`education-duration-${index}`} className={styles.label}>
						Duration
					</Label>
					<Input id={`education-duration-${index}`} value={edu.duration || ""} onChange={e => onChange(index, "duration", e.target.value)} className={styles.input} />
				</div>
				<div className={styles.formField}>
					<Label htmlFor={`education-note-${index}`} className={styles.label}>
						Note (Optional)
					</Label>
					<Textarea id={`education-note-${index}`} value={edu.note || ""} onChange={e => onChange(index, "note", e.target.value)} className={styles.textarea} rows={2} />
				</div>
			</div>
		</div>
	)
})

export default EducationItem
