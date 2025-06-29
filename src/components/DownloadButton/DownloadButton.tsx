import styles from './DownloadButton.module.css';

interface DownloadButtonProps {
  onClick: () => void;
}

const DownloadButton = ({ onClick }: DownloadButtonProps) => (
  <button type="button" onClick={onClick} className={styles.downloadBtn}>
    Download as PDF
  </button>
);

export default DownloadButton;
