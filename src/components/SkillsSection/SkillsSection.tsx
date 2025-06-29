import styles from './SkillsSection.module.css';

interface SkillsSectionProps {
  skills: string[];
  customColors: Record<string, string>;
}

const SkillsSection = ({ skills, customColors }: SkillsSectionProps) => {
  const colors = customColors || {};

  return (
    <section className={styles.skillsSection}>
      <h2
        className={styles.sectionTitle}
        style={{ color: colors['--charcoal'] }}
      >
        Skills
      </h2>
      {skills && skills.length > 0 ? (
        <ul className={styles.skillsList}>
          {skills.map((skill) => (
            <li
              key={skill}
              className={styles.skill}
              style={{
                backgroundColor: colors['--light-grey-background'],
                color: colors['--coffee'],
                borderColor: colors['--light-grey-border'],
              }}
            >
              {skill}
            </li>
          ))}
        </ul>
      ) : (
        <p
          className="text-gray-600 text-sm"
          style={{ color: colors['--coffee'] }}
        >
          No skills listed.
        </p>
      )}
    </section>
  );
};

export default SkillsSection;
