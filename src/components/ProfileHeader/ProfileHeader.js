import styles from "./ProfileHeader.module.css"
import colors from "../../utils/colors"

const ProfileHeader = ({ profileImage, name, title, summary }) => {
  // Check if we have a real profile image (not the default placeholder)
  const hasProfileImage =
    profileImage &&
    profileImage !== "/placeholder.svg?height=200&width=200" &&
    !profileImage.includes("placeholder") &&
    profileImage.trim() !== ""

  return (
    <div className={`${styles.header} ${!hasProfileImage ? styles.noImage : ""}`}>
      {/* Left: Profile Image - only show if image exists */}
      {hasProfileImage && (
        <div className={styles.left}>
          <img
            src={profileImage || "/placeholder.svg"}
            alt="Profile"
            className={styles["profile-image"]}
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "https://placehold.co/96x96/6b7280/FFFFFF?text=Profile"
            }}
          />
        </div>
      )}

      {/* Right: Name, Title, and Summary - spans full width when no image */}
      <div className={`${styles.right} ${!hasProfileImage ? styles.fullWidth : ""}`}>
        <h1 className="font-dm-mono-header text-md" style={{ color: colors["--charcoal"] }}>
          CURRICULUM VITAE
        </h1>
        <h2 className="text-2xl font-bold mb-1" style={{ color: colors["--charcoal"] }}>
          {name}
        </h2>
        <p className="text-md mb-4 font-dm-mono-subheading" style={{ color: colors["--teal-main"] }}>
          {title}
        </p>
        <section className="w-full">
          <p className={styles.contentBody}>{summary}</p>
        </section>
      </div>
    </div>
  )
}

export default ProfileHeader
