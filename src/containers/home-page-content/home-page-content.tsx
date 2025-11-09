"use client"

// import Image from "next/image";
import HomeToolItem from "@/src/components/home-tool-item"
import styles from "./home-page-content.module.css"

export default function HomePageContent() {
    return (
        <div className="w-screen max-w-[100vw] mb-24 mt-2 mx-auto md:pl-3 md:w-full md:min-w-[100%] md:max-w-[100vw]">
            <div className={styles.heroImageWrapper}>
                <div className={styles.heroImage} />


            </div>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.heroText}>
                        <h1 className={styles.heroTitle}>Ai Resume Builder Tools
                        </h1>
                        <p className={styles.heroSubtitle}>
                            Transform your career with our intelligent resume tools. Create tailored resumes from scratch or generate a
                            new professional design and layout from your existing resume powered by our super intelligent ai engine.<br /> Unlimited reviews, full edit control, and one-click export when you’re ready.

                        </p>
                    </div>
                </div>
            </section >
            <div className={styles.homeToolsWrapper}>
                <HomeToolItem
                    content={{
                        title: "Resume Tailor Tool",
                        description: "Give your job hunt a boost with our intelligent ai resume tailor tool.  Effortlessly and quickly tailor them to multiple job specifications. Customize a resumé or cv with beautiful colors, four modern design templates to choose from, share online or download as PDF. Save and Update multiple versions.",
                    }}
                    link={"free-ai-tools/resume-tailor"}
                />

                <HomeToolItem
                    content={{
                        title: "Ai Resume Builder",
                        description: "Easily and quickly create new modern resumés from your existing resume. Customize a resumé or cv with beautiful colors, four modern design templates to choose from, share online or download as PDF. Save and Update multiple versions.",
                    }}
                    link={"free-ai-tools/ai-resume-builder"}
                />
            </div>
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
        </div >
    )
}
