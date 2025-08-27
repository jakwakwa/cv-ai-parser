import { AlertTriangle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/ui-button/button"
import styles from "../containers/tool-containers/shared-tool.module.css"

interface ErrorModalProps {
	isOpen: boolean
	message: string
	onClose: () => void
	onStartOver: () => void
}

export function ErrorModal({ isOpen, message, onClose, onStartOver }: ErrorModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogTitle className={styles.errorTitle}>
					<AlertTriangle size={24} /> Error
				</DialogTitle>
				<DialogDescription className={styles.errorDescription}>{message}</DialogDescription>
				<div className={styles.errorModalActions}>
					<Button variant="outline" onClick={onClose}>
						Close
					</Button>
					<Button onClick={onStartOver}>Start Over</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
