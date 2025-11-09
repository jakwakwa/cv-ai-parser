// components/AuthComponent/AuthComponent.tsx

"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { Button } from "../ui/ui-button/button"
import styles from "./authComponent.module.css"

interface AuthComponentProps {
    onSuccess?: () => void
}

export default function AuthComponent({ onSuccess }: AuthComponentProps) {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        // Determine if the user is currently in the /free-ai-tools/ directory
        const isInToolsDirectory = window.location.pathname.startsWith("/free-ai-tools/")
        const redirectToUrl = isInToolsDirectory ? undefined : "/library"

        if (isSignUp) {
            // Sign up logic
            try {
                const res = await fetch("/api/register", {
                    method: "POST",
                    body: JSON.stringify({ email, password, name }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                })

                if (res.ok) {
                    // After successful sign-up, attempt to sign in
                    const callback = await signIn("credentials", {
                        email,
                        password,
                        redirect: false, // Always set to false to handle redirection manually
                        ...(redirectToUrl && { callbackUrl: redirectToUrl }), // Conditionally add callbackUrl
                    })

                    if (callback?.ok && !callback?.error) {
                        // If signIn is successful
                        if (callback.url && !isInToolsDirectory) {
                            // Only redirect if a URL is provided AND not in tools directory
                            window.location.href = callback.url
                        } else {
                            // Otherwise, use onSuccess or do nothing (if in tools directory)
                            onSuccess?.()
                        }
                    } else {
                        setError("Failed to sign in after sign up.")
                    }
                } else {
                    setError("Failed to sign up.")
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred")
            } finally {
                setLoading(false)
            }
        } else {
            // Sign in logic
            const callback = await signIn("credentials", {
                email,
                password,
                redirect: false, // Always set to false to handle redirection manually
                ...(redirectToUrl && { callbackUrl: redirectToUrl }), // Conditionally add callbackUrl
            })

            if (callback?.ok && !callback?.error) {
                // If signIn is successful
                if (callback.url && !isInToolsDirectory) {
                    // Only redirect if a URL is provided AND not in tools directory
                    window.location.href = callback.url
                } else {
                    // Otherwise, use onSuccess or do nothing (if in tools directory)
                    onSuccess?.()
                }
            } else {
                setError("Invalid credentials.")
            }
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.formColumn}>
                <h2 className={styles.formTitle}>{isSignUp ? "Create an account" : "Sign in to your account"}</h2>
                <form onSubmit={handleSubmit}>
                    {isSignUp && <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} className={styles.input} required />}
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className={styles.input} required />
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className={styles.input} required />

                    <Button variant="default" type="submit" disabled={loading} className={styles.submitButton}>
                        {loading ? "..." : isSignUp ? "Sign Up" : "Sign In"}
                    </Button>
                </form>
                <Button type="button" variant="link" onClick={() => setIsSignUp(!isSignUp)} className={styles.toggleButton}>
                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                </Button>
                {error && <p className={styles.errorMessage}>{error}</p>}
            </div>
        </div>
    )
}
