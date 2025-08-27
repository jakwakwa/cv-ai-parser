"use client"

import { X } from "lucide-react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/ui-button/button"
import ColorPicker from "../color-picker"
import styles from "./color-picker-dialog.module.css"

interface ColorPickerDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	currentColors: Record<string, string>
	onColorsChange: (colors: Record<string, string>) => void
}

const ColorPickerDialog = ({ open, onOpenChange, currentColors, onColorsChange }: ColorPickerDialogProps) => {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className={styles.dialogContent}>
				<DialogHeader className={styles.dialogHeader}>
					<div className={styles.headerContainer}>
						<div>
							<DialogTitle className={styles.dialogTitle}>Customize Resume Colors</DialogTitle>
							<DialogDescription className={styles.dialogDescription}>Choose from preset themes or create your own custom color scheme</DialogDescription>
						</div>
						<DialogClose asChild>
							<Button variant="outline" size="sm" className={styles.closeButton} aria-label="Close dialog">
								<X className="h-4 w-4" />
							</Button>
						</DialogClose>
					</div>
				</DialogHeader>

				<div className={styles.contentContainer}>
					<ColorPicker currentColors={currentColors} onColorsChange={onColorsChange} />
				</div>

				<div className={styles.footerContainer}>
					<DialogClose asChild>
						<Button variant="outline" className={styles.hideButton}>
							Hide
						</Button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default ColorPickerDialog
