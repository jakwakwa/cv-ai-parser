"use client"

import { createContext, useContext, useMemo, useState } from "react"

interface AuthModalContextType {
	isAuthModalOpen: boolean
	setAuthModalOpen: (open: boolean) => void
}

export const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined)

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

	const contextValue = useMemo(
		() => ({
			isAuthModalOpen,
			setAuthModalOpen: setIsAuthModalOpen,
		}),
		[isAuthModalOpen]
	)

	return <AuthModalContext.Provider value={contextValue}>{children}</AuthModalContext.Provider>
}

export const useAuthModal = () => {
	const context = useContext(AuthModalContext)
	if (context === undefined) {
		throw new Error("useAuthModal must be used within an AuthModalProvider")
	}
	return context
}
