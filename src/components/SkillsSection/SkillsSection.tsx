import { SkillsIcon } from '../Icons';
import styles from './SkillsSection.module.css';

interface SkillsSectionProps {
  skills: string[];
  customColors: Record<string, string>;
}

const SkillsSection = ({ skills, customColors }: SkillsSectionProps) => {
  // const colors = customColors || {};

  return (
    <section className={styles.skillsSection}>
      <h2
        className={styles.sectionTitle}
        style={{ color: customColors['--resume-profile-name'] }}
      >
        <SkillsIcon fill={customColors['--resume-main-icons']} />
        Skills
      </h2>
      {skills && skills.length > 0 ? (
        <div>
          {skills.map((skill) => (
            <span
              key={skill}
              className={styles.skill}
              style={{
                backgroundColor: 'rgba(255, 255,255,0.5)',
                color: customColors['--resume-job-title'],
                borderColor: customColors['--resume-skill-border'],
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p
          className="text-gray-600 text-sm"
          style={{ color: customColors['--resume-body-text'] }}
        >
          No skills listed.
        </p>
      )}
    </section>
  );
};

export default SkillsSection;
