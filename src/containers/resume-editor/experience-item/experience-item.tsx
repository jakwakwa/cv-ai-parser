'use client';

import { Trash2 } from 'lucide-react';
import { memo } from 'react';
import type { ParsedResumeSchema } from '@/lib/tools-lib/shared-parsed-resume-schema';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Textarea } from '@/src/components/ui/textarea';
import { Button } from '@/src/components/ui/ui-button/button';
import styles from './experience-item.module.css';

export interface ExperienceItemProps {
  job: NonNullable<ParsedResumeSchema['experience']>[number];
  index: number;
  onChange: <
    Field extends keyof NonNullable<ParsedResumeSchema['experience']>[number],
  >(
    index: number,
    field: Field,
    value: NonNullable<ParsedResumeSchema['experience']>[number][Field]
  ) => void;
  onRemove: (index: number) => void;
}

const ExperienceItem = memo(function ExperienceItem({
  job,
  index,
  onChange,
  onRemove,
}: ExperienceItemProps) {
  return (
    <div className={styles.experienceItem}>
      <div className={styles.experienceItemHeader}>
        <h3 className={styles.experienceItemTitle}>Job #{index + 1}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className={styles.removeExperienceButton}
        >
          <Trash2 className={styles.iconMd} />
        </Button>
      </div>
      <div className={styles.formGridFull}>
        <div className={styles.formField}>
          <Label htmlFor={`experience-title-${index}`} className={styles.label}>
            Job Title
          </Label>
          <Input
            id={`experience-title-${index}`}
            value={job.title || ''}
            onChange={(e) => onChange(index, 'title', e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formField}>
          <Label
            htmlFor={`experience-company-${index}`}
            className={styles.label}
          >
            Company
          </Label>
          <Input
            id={`experience-company-${index}`}
            value={job.company || ''}
            onChange={(e) => onChange(index, 'company', e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formField}>
          <Label
            htmlFor={`experience-duration-${index}`}
            className={styles.label}
          >
            Duration
          </Label>
          <Input
            id={`experience-duration-${index}`}
            value={job.duration || ''}
            onChange={(e) => onChange(index, 'duration', e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formField}>
          <Label
            htmlFor={`experience-details-${index}`}
            className={styles.label}
          >
            Details (one per line)
          </Label>
          <Textarea
            id={`experience-details-${index}`}
            value={job.details?.join('\n') || ''}
            onChange={(e) =>
              onChange(index, 'details', e.target.value.split('\n'))
            }
            className={styles.textarea}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
});

export default ExperienceItem;
