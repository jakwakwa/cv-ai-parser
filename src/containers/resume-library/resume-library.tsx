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
import { useCallback, useEffect, useState, useMemo } from 'react';
import { ResumeDatabase } from '@/lib/database';
import type { Resume } from '@/lib/types';
import { useAuth } from '@/src/components/auth-provider/auth-provider';
import { Badge } from '@/src/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/src/components/ui/card';
import styles from './resume-library.module.css';

export default function ResumeLibrary({
  onSelectResume,
}: {
  onSelectResume: (resume: Resume) => void;
}) {
  const { user, supabase } = useAuth();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadResumes = useCallback(async () => {
    if (!supabase) return;
    try {
      setLoading(true);
      const userResumes = await ResumeDatabase.getUserResumes(supabase);
      setResumes(userResumes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resumes');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (user) {
      loadResumes();
    }
  }, [user, loadResumes]);

  const handleDeleteResume = async (id: string, _title: string) => {
    if (!supabase) return;
    try {
      setError(''); // Clear any previous errors
      setDeleting(id);
      await ResumeDatabase.deleteResume(supabase, id);
      setResumes(resumes.filter((r) => r.id !== id));
      // Optional: Show success message
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete resume');
    } finally {
      setDeleting(null);
    }
  };

  const handleTogglePublic = async (resume: Resume) => {
    if (!supabase) {
      return;
    }
    try {
      const updated = await ResumeDatabase.updateResume(supabase, resume.id, {
        is_public: !resume.is_public,
      });
      setResumes(resumes.map((r) => (r.id === resume.id ? updated : r)));
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

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case 'ai':
        return styles.badgeGreen;
      case 'regex_fallback':
        return styles.badgeYellow;
      default:
        return styles.badgeGray;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'ai':
        return 'AI Parsed';
      case 'regex_fallback':
        return 'Text Analysis';
      default:
        return 'Unknown';
    }
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

  if (!user) {
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

  if (loading) {
    return <div className={styles.loadingSpinner} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Your Resume Library</h2>
          <p className={styles.subtitle}>
            {filteredResumes.length} of {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
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
                  : 'Upload your first resume to get started!'
                }
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
                      <button
                        type="button"
                        onClick={() => handleTogglePublic(resume)}
                        className={`${styles.publicToggle} ${
                          resume.is_public
                            ? styles.publicTogglePublic
                            : styles.publicTogglePrivate
                        }`}
                      >
                        {resume.is_public ? (
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
                    <div className={styles.contentRow}>
                      <span>Method:</span>
                      <Badge
                        className={`${styles.badge} ${getMethodBadgeColor(resume.parse_method || 'unknown')}`}
                      >
                        {getMethodLabel(resume.parse_method || 'unknown')}
                      </Badge>
                    </div>
                    {resume.confidence_score && (
                      <div className={styles.contentRow}>
                        <span>Confidence:</span>
                        <span className={styles.contentValue}>
                          {resume.confidence_score}%
                        </span>
                      </div>
                    )}
                    <div className={styles.contentRow}>
                      <span>Views:</span>
                      <span className={styles.contentIconContainer}>
                        <Eye className={styles.contentIcon} />
                        {resume.view_count}
                      </span>
                    </div>
                    <div className={styles.contentRow}>
                      <span>Downloads:</span>
                      <span className={styles.contentIconContainer}>
                        <Download className={styles.contentIcon} />
                        {resume.download_count}
                      </span>
                    </div>
                    <div className={styles.contentRow}>
                      <span>Created:</span>
                      <span className={styles.contentIconContainer}>
                        <Calendar className={styles.contentIcon} />
                        {formatDate(resume.created_at)}
                      </span>
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
                  {resume.is_public && resume.slug && (
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
                    onClick={() => handleDeleteResume(resume.id, resume.title)}
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
