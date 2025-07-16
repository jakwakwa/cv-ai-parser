import { X } from 'lucide-react';
import { memo } from 'react';
import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/ui-button/button';
import styles from './skill-pill.module.css';

interface SkillPillProps {
  skill: string;
  onRemove: (skill: string) => void;
}

const SkillPill = memo(function SkillPill({ skill, onRemove }: SkillPillProps) {
  return (
    <Badge className={styles.skillBadge}>
      {skill}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(skill)}
        className={styles.removeSkillButton}
      >
        <X className={styles.iconSm} />
      </Button>
    </Badge>
  );
});

export default SkillPill;
