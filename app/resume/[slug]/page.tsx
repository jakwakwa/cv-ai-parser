"use client";

import { ArrowLeft } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePdfDownloader } from "@/hooks/use-pdf-downloader";
import { useToast } from "@/hooks/use-toast";
import type { ParsedResumeSchema } from "@/lib/tools-lib/shared-parsed-resume-schema";
import type { Resume } from "@/lib/types";
import ResumeDisplayButtons from "@/src/components/resume-display-buttons/resume-display-buttons";
import { Button } from "@/src/components/ui/ui-button/button";
import ResumeDisplayWithSwitcher from "@/src/containers/resume-display-with-switcher/resume-display-with-switcher";
import ResumeEditor from "@/src/containers/resume-editor/resume-editor";
import styles from "./layout.module.css";

export default function ViewResumePage() {
    const router = useRouter();
    const params = useParams();
    const { slug } = params;
    const { isDownloading, downloadPdf } = usePdfDownloader();
    const { toast } = useToast();
    const { data: session } = useSession();

    const [viewMode, setViewMode] = useState<"view" | "edit">("view");
    const [resume, setResume] = useState<Resume | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [aiTailorCommentary, setAiTailorCommentary] = useState<string | null>(
        null
    );

    const searchParams = useSearchParams();

    useEffect(() => {
        const toastMessage = searchParams.get("toast");

        if (toastMessage) {
            switch (toastMessage) {
                case "resume_uploaded":
                    toast({
                        title: "Success!",
                        description: "Resume uploaded and parsed successfully!",
                    });
                    break;
                case "resume_saved":
                    toast({
                        title: "Success!",
                        description: "Resume saved successfully!",
                    });
                    break;
                case "view_error":
                    toast({
                        title: "Error",
                        description:
                            "Could not view resume: Missing necessary information.",
                        variant: "destructive",
                    });
                    break;
            }
            router.replace(window.location.pathname);
        }
    }, [searchParams, router, toast]);

    useEffect(() => {
        const fetchResume = async () => {
            if (!slug) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError("");
                const response = await fetch(`/api/resume/${slug}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch resume.");
                }
                const result = await response.json();
                setResume(result.data);
                if (result.data?.parsedData?.metadata?.aiTailorCommentary) {
                    setAiTailorCommentary(
                        result.data.parsedData.metadata.aiTailorCommentary
                    );
                } else {
                    setAiTailorCommentary(null);
                }
            } catch (err: unknown) {
                setError(
                    (err as Error).message ||
                    "An error occurred while loading the resume."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [slug]);

    useEffect(() => {
        if (slug) {
            // Use a separate effect to increment view count to avoid re-triggering on data change
            const incrementView = async () => {
                try {
                    await fetch(`/api/resume/${slug}/view`, { method: "POST" });
                } catch (error) {
                    console.error("Failed to increment view count:", error);
                }
            };
            incrementView();
        }
    }, [slug]); // Fire only once when slug is available

    const handleSaveEdits = async (updatedData: ParsedResumeSchema) => {
        if (!resume?.id) {
            setError("Cannot save: Resume ID is missing.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`/api/resumes/${resume.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ parsedData: updatedData }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to save resume edits.");
            }

            const result = await response.json();

            // Directly update the state with the returned data
            setResume(result);
            setViewMode("view");

            toast({
                title: "Success!",
                description: "Resume saved successfully!",
            });
        } catch (err: unknown) {
            setError((err as Error).message || "Failed to save edits.");
            toast({
                title: "Error",
                description: (err as Error).message || "Failed to save edits.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setViewMode("view");
    };

    const handleEdit = () => {
        setViewMode("edit");
    };

    const handleDownloadPdf = () => {
        if (resume) {
            downloadPdf(
                document.getElementById("resume-content") as HTMLElement,
                `${resume.parsedData.name?.replace(/ /g, "_") || "resume"}.pdf`
            );
        }
    };

    if (loading) {
        return (
            <div className="loadingContainer">
                <div className="loadingSpinner" />
                <p className="loadingText">
                    {viewMode === "edit" ? "Saving Changes..." : "Loading Resume..."}
                </p>
            </div>
        );
    }

    if (isDownloading) {
        return (
            <div className="loadingContainer">
                <div className="loadingSpinner" />
                <p className="loadingText">Downloading PDF...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
                <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
                <p className="text-gray-700 mb-6 text-center">{error}</p>
                <Button onClick={() => router.push("/library")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Library
                </Button>
            </div>
        );
    }

    if (!resume) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Resume Not Found
                </h2>
                <p className="text-gray-700 mb-6 text-center">
                    The resume you are looking for does not exist or is not public.
                </p>
                <Button onClick={() => router.push("/library")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Library
                </Button>
            </div>
        );
    }

    if (viewMode === "edit") {
        return (
            <ResumeEditor
                resumeData={resume.parsedData}
                onSave={handleSaveEdits}
                onCancel={handleCancelEdit}
                onCustomColorsChange={(colors) =>
                    setResume((prevResume) => {
                        if (!prevResume) return null;
                        return {
                            ...prevResume,
                            parsedData: {
                                ...prevResume.parsedData,
                                customColors: colors,
                            },
                        };
                    })
                }
            />
        );
    }

    return (
        <div className={styles.resumeContainer}>
            <ResumeDisplayButtons
                onDownloadPdf={handleDownloadPdf}
                onEditResume={handleEdit}
                onMyLibrary={() => router.push("/library")}
                onUploadNew={() => router.push("/free-ai-tools/resume-tailor")}
                showDownload={true}
                showEdit={true}
                showLibrary={true}
                showUploadNew={true}
                isAuthenticated={!!session}
                isOnResumePage={true}
                maxMobileButtons={2}
            />
            <ResumeDisplayWithSwitcher
                resumeData={resume.parsedData}
                isAuth={true}
                aiTailorCommentary={aiTailorCommentary}
            />
        </div>
    );
}
