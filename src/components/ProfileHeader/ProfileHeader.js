import React from 'react';
import styles from './ProfileHeader.module.css';
import colors from '../../utils/colors';

const ProfileHeader = ({ profileImage, name, title, summary }) => (
  <div className={styles.header}>
    {/* Left: Profile Image with circular frame and gradient background */}
    <div className={styles.left}>
      <img
        src={profileImage}
        alt="Profile"
        className={styles['profile-image']}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/96x96/6b7280/FFFFFF?text=Profile";
        }}
      />
    </div>
    {/* Right: Name, Title, and Summary */}
    <div className={styles.right}>
      <h1 className="font-dm-mono-header text-md" style={{ color: colors['--charcoal'] }}>CURRICULUM VITAE</h1>
      <h2 className="text-2xl font-bold mb-1" style={{ color: colors['--charcoal'] }}>{name}</h2>
      <p className="text-md mb-4 font-dm-mono-subheading" style={{ color: colors['--teal-main'] }}>{title}</p>
      <section className="w-full">
        <p className={styles.contentBody}>{summary}</p>
      </section>
    </div>
  </div>
);

export default ProfileHeader;
