"use client"

import { FileText, Globe, Lock, Search, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import type { Resume } from "@/lib/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/src/components/ui/accordion"
import { Card, CardContent, CardFooter, CardHeader } from "@/src/components/ui/card"
import styles from "./resume-library.module.css"

export default function ResumeLibrary({
	initialResumes,
	onSelectResume,
	onResumesUpdate,
	userId,
}: {
	initialResumes: Resume[]
	onSelectResume: (resume: Resume) => void
	onResumesUpdate: (resumes: Resume[]) => void
	userId: string
}) {
	const [resumes, setResumes] = useState<Resume[]>(initialResumes)
	const [error, setError] = useState("")
	const [deleting, setDeleting] = useState<string | null>(null)
	const [searchTerm, setSearchTerm] = useState("")

	const handleDeleteResume = async (id: string) => {
		try {
			setError("")
			setDeleting(id)
			const response = await fetch(`/api/resumes/${id}`, { method: "DELETE" })
			if (!response.ok) {
				throw new Error("Failed to delete resume")
			}
			const updatedResumes = resumes.filter(r => r.id !== id)
			setResumes(updatedResumes)
			onResumesUpdate(updatedResumes) // Notify parent component
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete resume")
		} finally {
			setDeleting(null)
		}
	}

	const handleTogglePublic = async (resume: Resume) => {
		try {
			const response = await fetch(`/api/resumes/${resume.id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ isPublic: !resume.isPublic }),
			})
			toast({
				variant: "default",
				title: "Public Visibility Changed:",
				description: `Resume '${resume.slug}' was successfully set to ${resume.isPublic ? "private" : "public"}!`,
			})

			if (!response.ok) {
				throw new Error("Failed to update resume")
			}
			const updatedResume = await response.json()
			const updatedResumes = resumes.map(r => (r.id === resume.id ? updatedResume : r))
			setResumes(updatedResumes)
			onResumesUpdate(updatedResumes) // Notify parent component
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update resume")
		}
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		})
	}

	// Filter resumes based on search term (slug name)
	const filteredResumes = useMemo(() => {
		if (!searchTerm.trim()) {
			return resumes
		}

		const normalizedSearchTerm = searchTerm.toLowerCase().trim()
		return resumes.filter(resume => {
			// Search in slug name if it exists
			if (resume.slug) {
				return resume.slug.toLowerCase().includes(normalizedSearchTerm)
			}
			// Fallback to searching in title if no slug
			return resume.title.toLowerCase().includes(normalizedSearchTerm)
		})
	}, [resumes, searchTerm])

	const { toast } = useToast()
	if (!userId) {
		return (
			<div className={styles.container}>
				<div className={styles.wrapper}>
					<div className={styles.stateContainer}>
						<div className={styles.stateContent}>
							<div className={styles.iconContainer}>
								<FileText className={styles.icon} />
							</div>
							<h2 className={styles.stateTitle}>Sign In Required</h2>
							<p className={styles.stateText}>Please sign in to view your resume library.</p>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className={styles.container}>
			<div className={styles.wrapper}>
				<div className={styles.header}>
					<h2 className={styles.title}>Your saved resumes:</h2>
					<p className={styles.subtitle}>
						Here you can view all your saved resumes. You can view, share, or set each resume to private or public. To edit a resume, click "View" and then select "Edit Resume."
					</p>
					<p className={styles.resumeCounter}>
						Viewiing {filteredResumes.length} of {resumes.length} saved resume
						{resumes.length !== 1 ? "s" : ""}
					</p>
				</div>

				<div className={styles.mainContent}>
					{/* Educational Content Sidebar */}
					<aside className={styles.educationalSidebar}>
						<div className={styles.educationalCard}>
							<div className={styles.cardHeader}>
								<h3 className={styles.cardTitle}>Resume Management Guide</h3>
							</div>

							<div className={styles.educationalContent}>
								<section className={styles.introSection}>
									<Accordion type="single" collapsible className={styles.accordion}>
										<AccordionItem value="intro">
											<AccordionTrigger className={styles.accordionTrigger}>
												<h3 className={styles.sectionTitle}>Professional Resume Management Made Simple</h3>
											</AccordionTrigger>
											<AccordionContent className={styles.accordionContent}>
												<div className={styles.accordionInner}>
													<p className={styles.sectionText}>
														Your resume library is the central hub for managing all your professional documents. Store multiple versions of your resume, each tailored for different industries, job
														types, or career stages. Our intelligent organization system helps you track performance metrics, manage visibility settings, and maintain a comprehensive portfolio of your
														professional presence. With advanced analytics and sharing controls, you can optimize your job search strategy and present the right version of your professional story to
														each opportunity.
													</p>
												</div>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</section>

								<section className={styles.featuresSection}>
									<Accordion type="single" collapsible className={styles.accordion}>
										<AccordionItem value="features">
											<AccordionTrigger className={styles.accordionTrigger}>
												<h3 className={styles.sectionTitle}>Smart Resume Organization Features</h3>
											</AccordionTrigger>
											<AccordionContent className={styles.accordionContent}>
												<div className={styles.accordionInner}>
													<div className={styles.featuresList}>
														<div className={styles.featureItem}>
															<strong>Version Control:</strong> Keep track of different resume versions with automatic timestamping and clear naming conventions.
														</div>
														<div className={styles.featureItem}>
															<strong>Performance Analytics:</strong> Monitor view counts and download metrics to understand which resumes generate the most interest.
														</div>
														<div className={styles.featureItem}>
															<strong>Privacy Controls:</strong> Toggle between public and private sharing settings to control your professional visibility.
														</div>
														<div className={styles.featureItem}>
															<strong>Easy Sharing:</strong> Generate shareable links for public resumes and track engagement with potential employers.
														</div>
													</div>
												</div>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</section>

								<section className={styles.bestPracticesSection}>
									<Accordion type="single" collapsible className={styles.accordion}>
										<AccordionItem value="best-practices">
											<AccordionTrigger className={styles.accordionTrigger}>
												<h3 className={styles.sectionTitle}>Resume Library Best Practices</h3>
											</AccordionTrigger>
											<AccordionContent className={styles.accordionContent}>
												<div className={styles.accordionInner}>
													<h4 className={styles.accordionSubtitle}>Maximize Your Job Search Success</h4>
													<p className={styles.sectionText}>
														Maximize your job search success by organizing your resumes strategically. Create industry-specific versions that highlight relevant skills and experiences. Use descriptive
														names that reflect the target role or company. Regularly update your resumes with new achievements and skills. Keep both public versions for networking and private versions
														for sensitive applications.
													</p>

													<h4 className={styles.accordionSubtitle}>Monitor Your Resume Performance</h4>
													<p className={styles.sectionText}>
														Monitor your resume performance metrics to understand which versions generate the most interest. Public resumes with higher view counts often indicate content that
														resonates with your target audience. Use this data to refine your other resume versions and improve your overall job search effectiveness.
													</p>
												</div>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</section>
							</div>
						</div>
					</aside>

					{/* Main Resume List Content */}
					<main className={styles.resumeListContent}>
						{/* Search Filter */}
						<div className={styles.searchContainer}>
							<div className={styles.searchInputWrapper}>
								<Search className={styles.searchIcon} />
								<input type="text" placeholder="Filter by resume name..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className={styles.searchInput} />
							</div>
						</div>

						{error && (
							<div className={styles.errorContainer}>
								<p className={styles.errorText}>{error}</p>
							</div>
						)}

						{filteredResumes.length === 0 ? (
							<div className={styles.stateContainer}>
								<div className={styles.stateContent}>
									<div className={styles.iconContainer}>
										<FileText className={styles.iconGray} />
									</div>
									<h3 className={styles.stateTitle}>{searchTerm ? "No matching resumes" : "No resumes yet"}</h3>
									<p className={styles.stateText}>{searchTerm ? `No resumes found matching "${searchTerm}". Try adjusting your search term.` : "Upload your first resume to get started!"}</p>
								</div>
							</div>
						) : (
							<div className={styles.grid}>
								{filteredResumes.map(resume => (
									<Card key={resume.id} className={styles.card}>
										<CardHeader className={styles.cardHeader}>
											<div className={styles.cardHeaderContent}>
												<h3 className={styles.cardTitle}>{resume.title}</h3>
												<div className={styles.publicToggleContainer}>
													{/* <div className={styles.cardTitleLabel}>visibility</div> */}
													<button
														type="button"
														onClick={() => handleTogglePublic(resume)}
														className={`${styles.publicToggle} ${resume.isPublic ? styles.publicTogglePublic : styles.publicTogglePrivate}`}>
														{resume.isPublic ? (
															<>
																<Globe className={styles.publicToggleIcon} />
																Public
															</>
														) : (
															<>
																<Lock className={styles.publicToggleIcon} />
																Private
															</>
														)}
													</button>
												</div>
											</div>
										</CardHeader>

										<CardContent className={styles.cardContent}>
											<div className={styles.contentText}>
												<div>
													{resume.confidenceScore && (
														<div className={styles.statItem}>
															<span className={styles.statLabel}>Resume Id:</span>
															<span className={styles.statValue}>{resume.slug}</span>
														</div>
													)}
												</div>
												<div className={styles.contentTextRight}>
													<div className={styles.statItem}>
														<span className={styles.statLabel}>Views:</span>
														<span className={styles.statValue}>{resume.viewCount}</span>
													</div>
													<div className={styles.statItem}>
														<span className={styles.statLabel}>Downloads:</span>
														<span className={styles.statValue}>{resume.downloadCount}</span>
													</div>
													<div className={styles.statItem}>
														<span className={styles.statLabel}>Created:</span>
														<span className={styles.statValue}>{formatDate(resume.createdAt)}</span>
													</div>

													<div>{resume.parsedData.metadata?.aiTailorCommentary && <p className={styles.aiSummaryPlaintext}>{resume.parsedData.metadata.aiTailorCommentary}</p>}</div>
												</div>
											</div>
										</CardContent>

										<CardFooter className={styles.cardFooter}>
											<button type="button" onClick={() => onSelectResume(resume)} className={styles.viewButton}>
												View
											</button>
											{resume.isPublic && resume.slug && (
												<button
													type="button"
													onClick={() => {
														toast({
															title: "Copied to clipboard",
															variant: "default",
															description: `www.airesumegen.com/resume/${resume.slug}`,
														})
														navigator.clipboard.writeText(`${window.location.origin}/resume/${resume.slug}`)
													}}
													className={styles.shareButton}>
													Share
												</button>
											)}
											<button type="button" onClick={() => handleDeleteResume(resume.id)} disabled={deleting === resume.id} className={styles.deleteButton}>
												{deleting === resume.id ? <div className={styles.deleteSpinner} /> : <Trash2 className={styles.deleteIcon} />}
											</button>
										</CardFooter>
									</Card>
								))}
							</div>
						)}
					</main>
				</div>
			</div>
		</div>
	)
}
