import { Plus } from 'lucide-react';
import { CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/ui-button/button';
import styles from './section-header.module.css';

interface SectionHeaderProps {
  title: string;
  onAdd?: () => void;
}

const SectionHeader = ({ title, onAdd }: SectionHeaderProps) => (
  <CardHeader className={styles.sectionHeader}>
    <CardTitle className={styles.cardTitle}>{title}</CardTitle>
    {onAdd && (
      <Button onClick={onAdd} className={styles.addButton}>
        <Plus className={styles.iconMd} />
      </Button>
    )}
  </CardHeader>
);

export default SectionHeader;
