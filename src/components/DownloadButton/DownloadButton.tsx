import { Button } from '@/src/components/ui/button';
import styles from './DownloadButton.module.css';

interface DownloadButtonProps {
  onClick: () => void;
  className?: string;
}

const DownloadButton = ({ onClick, className }: DownloadButtonProps) => (
  <Button
    type="button"
    onClick={onClick}
    variant="secondary"
    className={className}
  >
    Download as PDF
  </Button>
);

export default DownloadButton;
