'use client';

import {
  Calendar,
  Download,
  Eye,
  FileText,
  Globe,
  Lock,
  Search,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Resume } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/src/components/ui/card';
import styles from './resume-library.module.css';

export default function ResumeLibrary({
  initialResumes,
  onSelectResume,
  onResumesUpdate,
  userId,
}: {
  initialResumes: Resume[];
  onSelectResume: (resume: Resume) => void;
  onResumesUpdate: (resumes: Resume[]) => void;
  userId: string;
}) {
  const [resumes, setResumes] = useState<Resume[]>(initialResumes);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteResume = async (id: string) => {
    try {
      setError('');
      setDeleting(id);
      const response = await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete resume');
      }
      const updatedResumes = resumes.filter((r) => r.id !== id);
      setResumes(updatedResumes);
      onResumesUpdate(updatedResumes); // Notify parent component
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resume');
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublic = async (resume: Resume) => {
    try {
      const response = await fetch(`/api/resumes/${resume.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !resume.isPublic }),
      });
      if (!response.ok) {
        throw new Error('Failed to update resume');
      }
      const updatedResume = await response.json();
      const updatedResumes = resumes.map((r) =>
        r.id === resume.id ? updatedResume : r
      );
      setResumes(updatedResumes);
      onResumesUpdate(updatedResumes); // Notify parent component
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update resume');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter resumes based on search term (slug name)
  const filteredResumes = useMemo(() => {
    if (!searchTerm.trim()) {
      return resumes;
    }

    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    return resumes.filter((resume) => {
      // Search in slug name if it exists
      if (resume.slug) {
        return resume.slug.toLowerCase().includes(normalizedSearchTerm);
      }
      // Fallback to searching in title if no slug
      return resume.title.toLowerCase().includes(normalizedSearchTerm);
    });
  }, [resumes, searchTerm]);

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
              <p className={styles.stateText}>
                Please sign in to view your resume library.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Your Resume Library</h2>
          <p className={styles.subtitle}>
            {filteredResumes.length} of {resumes.length} resume
            {resumes.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Search Filter */}
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Filter by slug name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
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
              <h3 className={styles.stateTitle}>
                {searchTerm ? 'No matching resumes' : 'No resumes yet'}
              </h3>
              <p className={styles.stateText}>
                {searchTerm
                  ? `No resumes found matching "${searchTerm}". Try adjusting your search term.`
                  : 'Upload your first resume to get started!'}
              </p>
            </div>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredResumes.map((resume) => (
              <Card key={resume.id} className={styles.card}>
                <CardHeader className={styles.cardHeader}>
                  <div className={styles.cardHeaderContent}>
                    <h3 className={styles.cardTitle}>{resume.title}</h3>
                    <div className={styles.publicToggleContainer}>
                      {/* <div className={styles.cardTitleLabel}>visibility</div> */}
                      <button
                        type="button"
                        onClick={() => handleTogglePublic(resume)}
                        className={`${styles.publicToggle} ${
                          resume.isPublic
                            ? styles.publicTogglePublic
                            : styles.publicTogglePrivate
                        }`}
                      >
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
                          <span className={styles.statLabel}>Confidence:</span>
                          <span className={styles.statValue}>
                            {resume.confidenceScore}%
                          </span>
                        </div>
                      )}
                    </div>
                    <div className={styles.contentTextRight}>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Views:</span>
                        <span className={styles.statValue}>
                          {resume.viewCount}
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Downloads:</span>
                        <span className={styles.statValue}>
                          {resume.downloadCount}
                        </span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Created:</span>
                        <span className={styles.statValue}>
                          {formatDate(resume.createdAt)}
                        </span>
                      </div>

                      <div>
                        {resume.parsedData.metadata?.aiTailorCommentary && (
                          <p className={styles.aiSummaryPlaintext}>
                            {resume.parsedData.metadata.aiTailorCommentary}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className={styles.cardFooter}>
                  <button
                    type="button"
                    onClick={() => onSelectResume(resume)}
                    className={styles.viewButton}
                  >
                    View
                  </button>
                  {resume.isPublic && resume.slug && (
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${window.location.origin}/resume/${resume.slug}`
                        )
                      }
                      className={styles.shareButton}
                    >
                      Share
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDeleteResume(resume.id)}
                    disabled={deleting === resume.id}
                    className={styles.deleteButton}
                  >
                    {deleting === resume.id ? (
                      <div className={styles.deleteSpinner} />
                    ) : (
                      <Trash2 className={styles.deleteIcon} />
                    )}
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
