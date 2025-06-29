import styles from './ExperienceSection.module.css';

interface ExperienceItem {
  title?: string;
  company?: string;
  duration?: string;
  details: string[];
}

interface ExperienceSectionProps {
  experience: ExperienceItem[];
  customColors: Record<string, string>;
}

const ExperienceSection = ({
  experience,
  customColors,
}: ExperienceSectionProps) => {
  const colors = customColors || {};

  return (
    <section className={styles.experienceSection}>
      <h2
        className={styles.sectionTitle}
        style={{ color: colors['--charcoal'] }}
      >
        Experience
      </h2>
      {experience.length > 0 ? (
        experience.map((job, index) => (
          <div
            key={`${job.company}-${job.title}-${index}`}
            className="avoid-break mb-6 last:mb-0"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3
                  className={styles.jobTitle}
                  style={{ color: colors['--teal-main'] }}
                >
                  {job.title}
                </h3>
                {job.company && (
                  <p
                    className={styles.company}
                    style={{ color: colors['--bronze-dark'] }}
                  >
                    {job.company}
                  </p>
                )}
                {job.duration && (
                  <p
                    className={styles.duration}
                    style={{ color: colors['--charcoal'] }}
                  >
                    {job.duration}
                  </p>
                )}
              </div>
            </div>
            {job.details && job.details.length > 0 && (
              <ul className={styles.details}>
                {job.details.map((detail) => (
                  <li
                    key={detail}
                    className={styles.detailItem}
                    style={{ color: colors['--coffee'] }}
                  >
                    {detail}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      ) : (
        <p
          className="text-gray-600 text-sm"
          style={{ color: colors['--coffee'] }}
        >
          No experience details available.
        </p>
      )}
    </section>
  );
};

export default ExperienceSection;
