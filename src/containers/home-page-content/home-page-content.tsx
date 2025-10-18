"use client"

import Image from "next/image"
import HomeToolItem from "@/src/components/home-tool-item"
import styles from "./home-page-content.module.css"

export default function HomePageContent() {
    return (
        <div className="w-screen max-w-[95vw] mb-24 mt-2 mx-auto md:pl-3 md:w-full md:min-w-[90%] md:max-w-[80vw]">
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.heroText}>
                        <h1 className={styles.heroTitle}>AI-Powered Resume Generator</h1>
                        <p className={styles.heroSubtitle}>
                            Transform your career with our intelligent resume tools. Create tailored resumes from scratch or generate a new professional    design and layout from your existing resume.
                        </p>
                    </div>
                    <div className={styles.heroImageWrapper}>
                        <div className={styles.heroImageGlow} />
                        <Image
                            src="/home-hero-img.png"
                            alt="AI-powered resume generation illustration showing intelligent document processing"
                            width={600}
                            height={600}
                            priority
                            className={styles.heroImage}
                        />
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <div className={styles.homeToolsWrapper}>
                <HomeToolItem
                    content={{
                        title: "Resume Tailor Tool",
                        description: "Transform your career with our intelligent resume tools. Create tailored resumes from scratch or convert your Figma designs into professional resume components.",
                    }}
                    link={"tools/ai-resume-tailor"}
                />

                <HomeToolItem
                    content={{
                        title: "Resume Generator / Parser",
                        description: "Transform your career with our intelligent resume tools. Create tailored resumes from scratch or convert your Figma designs into professional resume components.",
                    }}
                    link={"tools/ai-resume-generator"}
                />
            </div>

            {/* Benefits Section */}
            <section className={styles.benefits}>
                <h2 className={styles.sectionTitle}>Why Choose Our Tools?</h2>
                <div className={styles.benefitsGrid}>
                    <div className={styles.benefit}>
                        <h4>AI-Powered</h4>
                        <p>Advanced AI analyzes job requirements and optimizes your resume content</p>
                    </div>
                    <div className={styles.benefit}>
                        <h4>Professional Design</h4>
                        <p>Clean, modern templates that make your resume stand out</p>
                    </div>
                    <div className={styles.benefit}>
                        <h4>Fast & Easy</h4>
                        <p>Get a tailored resume in minutes, not hours</p>
                    </div>
                    <div className={styles.benefit}>
                        <h4>Customizable</h4>
                        <p>Full control over colors, fonts, and layout</p>
                    </div>
                </div>
            </section>
        </div>
    )
}
