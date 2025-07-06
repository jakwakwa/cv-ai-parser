import { Button } from '@/src/components/ui/ui-button/button';

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
