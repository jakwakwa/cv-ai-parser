import styles from './ProfileHeader.module.css';

interface ProfileHeaderProps {
  profileImage: string;
  name: string;
  title: string;
  summary: string;
  customColors: Record<string, string>;
}

const ProfileHeader = ({
  profileImage,
  name,
  title,
  summary,
  customColors,
}: ProfileHeaderProps) => {
  const showTitle =
    title && title.toLowerCase() !== 'professional' && title !== summary;

  // Check if we have a real profile image (not the default placeholder)
  const hasProfileImage =
    profileImage &&
    profileImage !== '/placeholder.svg?height=200&width=200' &&
    !profileImage.includes('placeholder') &&
    profileImage.trim() !== '';

  return (
    <div
      className={`${styles.header} ${!hasProfileImage ? styles.noImage : ''}`}
    >
      {/* Left: Profile Image - only show if image exists */}
      {hasProfileImage && (
        <div className={styles.left}>
          {/** biome-ignore lint/performance/noImgElement: <> */}
          <img
            src={profileImage || '/placeholder.svg'}
            alt="Profile"
            className={styles['profile-image']}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              (e.target as HTMLImageElement).onerror = null;
              (e.target as HTMLImageElement).src =
                'https://placehold.co/96x96/6b7280/FFFFFF?text=Profile';
            }}
          />
        </div>
      )}

      {/* Right: Name, Title, and Summary - spans full width when no image */}
      <div
        className={`${styles.right} ${!hasProfileImage ? styles.fullWidth : ''}`}
      >
        <h1
          className="font-dm-mono-header text-md"
          style={{ color: customColors['--resume-profile-name'] }}
        >
          CURRICULUM VITAE
        </h1>
        <h2
          className="text-2xl font-bold mb-1"
          style={{ color: customColors['--resume-profile-name'] }}
        >
          {name}
        </h2>
        {showTitle && (
          <p
            className="text-md mb-4 font-dm-mono-subheading"
            style={{ color: customColors['--resume-job-title'] }}
          >
            {title}
          </p>
        )}
        <section className="w-full">
          <p
            className={styles.contentBody}
            style={{ color: customColors['--resume-body-text'] }}
          >
            {summary}
          </p>
        </section>
      </div>
    </div>
  );
};

export default ProfileHeader;
