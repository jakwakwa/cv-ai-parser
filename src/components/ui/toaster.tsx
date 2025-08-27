"use client"

import { useToast } from "@/hooks/use-toast"
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/src/components/ui/toast"

export function Toaster() {
	const { toasts } = useToast()

	return (
		<ToastProvider>
			{toasts.map(({ id, title, description, action, variant, ...props }) => (
				<Toast
					key={id}
					{...props}
					style={
						variant === "destructive"
							? { background: "#d5667d" }
							: variant === "default" || variant == null
								? {
										backgroundColor: "#ccfff5",
										background: "linear-gradient(211deg,rgba(204, 255, 245, 1) 0%, rgba(113, 227, 202, 1) 100%)",
										color: "#152437",
										fontWeight: "800",
									}
								: undefined
					}>
					<div className="grid gap-1">
						{title && <ToastTitle>{title}</ToastTitle>}
						{description && <ToastDescription>{description}</ToastDescription>}
					</div>
					{action}
					<ToastClose />
				</Toast>
			))}
			<ToastViewport />
		</ToastProvider>
	)
}
