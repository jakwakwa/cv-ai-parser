import { Slot } from "@radix-ui/react-slot"
import * as React from "react"
import { cn } from "@/lib/utils"
import styles from "./button.module.css"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
	size?: "default" | "sm" | "lg" | "icon"
	nav?: boolean // Add this prop
	asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant = "teal",
			size = "default",
			nav = false, // Add this prop with default value
			asChild = false,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : "button"

		const buttonClasses = cn(
			styles.button,
			styles[variant],
			styles[size],
			nav && styles.nav, // Add conditional nav class
			className,
			"disabled:opacity-50 disabled:cursor-not-allowed"
		)

		return <Comp className={buttonClasses} ref={ref} {...props} />
	}
)
Button.displayName = "Button"

export { Button }
