'use client';

import { Trash2 } from 'lucide-react';
import { memo } from 'react';
import type { EnhancedParsedResume } from '@/lib/resume-parser/enhanced-schema';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Button } from '@/src/components/ui/ui-button/button';
import styles from './certification-item.module.css';

interface CertificationItemProps {
  cert: NonNullable<EnhancedParsedResume['certifications']>[number];
  index: number;
  onChange: <
    Field extends keyof NonNullable<EnhancedParsedResume['certifications']>[number],
  >(
    index: number,
    field: Field,
    value: NonNullable<EnhancedParsedResume['certifications']>[number][Field]
  ) => void;
  onRemove: (index: number) => void;
}

const CertificationItem = memo(function CertificationItem({
  cert,
  index,
  onChange,
  onRemove,
}: CertificationItemProps) {
  return (
    <div className={styles.itemContainer}>
      <div className={styles.itemHeader}>
        <h3 className={styles.itemTitle}>Certification #{index + 1}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(index)}
          className={styles.removeButton}
        >
          <Trash2 className={styles.iconMd} />
        </Button>
      </div>
      <div className={styles.formGrid}>
        <div className={styles.formField}>
          <Label htmlFor={`cert-name-${index}`} className={styles.label}>
            Certification Name
          </Label>
          <Input
            id={`cert-name-${index}`}
            value={cert.name || ''}
            onChange={(e) => onChange(index, 'name', e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formField}>
          <Label htmlFor={`cert-issuer-${index}`} className={styles.label}>
            Issuer
          </Label>
          <Input
            id={`cert-issuer-${index}`}
            value={cert.issuer || ''}
            onChange={(e) => onChange(index, 'issuer', e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formField}>
          <Label htmlFor={`cert-date-${index}`} className={styles.label}>
            Date (Optional)
          </Label>
          <Input
            id={`cert-date-${index}`}
            value={cert.date || ''}
            onChange={(e) => onChange(index, 'date', e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formField}>
          <Label htmlFor={`cert-id-${index}`} className={styles.label}>
            Credential ID (Optional)
          </Label>
          <Input
            id={`cert-id-${index}`}
            value={cert.id || ''}
            onChange={(e) => onChange(index, 'id', e.target.value)}
            className={styles.input}
          />
        </div>
      </div>
    </div>
  );
});

export default CertificationItem;
