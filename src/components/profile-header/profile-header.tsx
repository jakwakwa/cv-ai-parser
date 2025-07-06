import styles from './profile-header.module.css';

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
  const lowerImg = (profileImage || '').toLowerCase();
  console.log('Debug profileImage:', { 
    original: profileImage, 
    lowerImg, 
    trimmed: lowerImg.trim(),
    includesPlaceholder: lowerImg.includes('placeholder'),
    includesPlaceholdCo: lowerImg.includes('placehold.co')
  });
  const hasProfileImage =
    lowerImg &&
    lowerImg.trim() !== '' &&
    !lowerImg.includes('placeholder') &&
    !lowerImg.includes('placehold.co');
  console.log('hasProfileImage result:', hasProfileImage);

  return (
    <div
      className={`${styles.header} ${!hasProfileImage ? styles.noImage : ''}`}
    >
      {/* Left: Profile Image - only show if image exists */}
      {hasProfileImage && (
        <div className={styles.left}>
          {/** biome-ignore lint/performance/noImgElement: <> */}
          <img
            src={profileImage}
            alt="Profile"
            className={styles['profile-image']}
          />
        </div>
      )}

      {/* Right: Name, Title, and Summary - spans full width when no image */}
      <div
        className={`${styles.right} ${!hasProfileImage ? styles.fullWidth : ''}`}
      >
        <h1
          className={styles.cvHeader}
          style={{ color: customColors['--resume-profile-name'] }}
        >
          CURRICULUM VITAE
        </h1>
        <h2
          className={styles.profileName}
          style={{ color: customColors['--resume-profile-name'] }}
        >
          {name}
        </h2>
        {showTitle && (
          <p
            className={styles.jobTitle}
            style={{ color: customColors['--resume-job-title'] }}
          >
            {title}
          </p>
        )}
        <section className={styles.summarySection}>
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
