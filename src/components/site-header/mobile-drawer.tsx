"use client"

import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useEffect } from "react"
import styles from "./mobile-drawer.module.css"

interface MobileDrawerProps {
    isOpen: boolean
    onClose: () => void
    isAuthenticated?: boolean
}

export function MobileDrawer({ isOpen, onClose, isAuthenticated = false }: MobileDrawerProps) {
    // Close drawer when clicking on a link
    const handleLinkClick = () => {
        onClose()
    }

    // Close drawer when pressing escape key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown)
            // Prevent body scroll when drawer is open
            document.body.style.overflow = "hidden"
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown)
            document.body.style.overflow = "unset"
        }
    }, [isOpen, onClose])

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div className={styles.backdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={onClose} />

                    {/* Drawer */}
                    <motion.div
                        className={styles.drawer}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                        }}>
                        <div className={styles.handle} />

                        <div className={styles.content}>
                            <nav className={styles.navigation}>
                                <Link href="/free-ai-tools/resume-tailor" className={styles.navLink} onClick={handleLinkClick}>
                                    Resume Tailor
                                </Link>
                                {/* Only show library link for authenticated users */}
                                {isAuthenticated && (
                                    <Link href="/library" className={styles.navLink} onClick={handleLinkClick}>
                                        My Resumes
                                    </Link>
                                )}
                                <Link href="/resources" className={styles.navLink} onClick={handleLinkClick}>
                                    Docs
                                </Link>
                            </nav>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
