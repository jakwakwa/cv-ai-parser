import { CertificationsIcon } from '../Icons';
import styles from './CertificationsSection.module.css';

interface CertificationItem {
  name: string;
  issuer: string;
  date?: string;
  id?: string;
}

interface CertificationsSectionProps {
  certifications?: CertificationItem[];
  customColors: Record<string, string>;
}

const CertificationsSection = ({
  certifications,
  customColors,
}: CertificationsSectionProps) => {
  const colors = customColors || {};

  return (
    <section className={styles.certificationsSection}>
      <h2
        className={styles.sectionTitle}
        style={{ color: colors['--charcoal'] }}
      >
        <CertificationsIcon fill={colors['--bronze-dark']} />
        Certifications
      </h2>
      {certifications && certifications.length > 0 ? (
        <div className={styles.certificationsList}>
          {certifications.map((cert) => (
            <div
              key={cert.id || cert.name}
              className={styles.certificationItem}
            >
              <p className="subject" style={{ color: colors['--teal-main'] }}>
                {cert.name}
              </p>
              <p className="issuer" style={{ color: colors['--bronze-dark'] }}>
                {cert.issuer}
              </p>
              {cert.date && (
                <p className="date" style={{ color: colors['--charcoal'] }}>
                  {cert.date}
                </p>
              )}
              {cert.id && (
                <p
                  className={styles.credentialId}
                  style={{ color: colors['--coffee'] }}
                >
                  ID: {cert.id}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noCerts} style={{ color: colors['--coffee'] }}>
          No certifications listed.
        </p>
      )}
    </section>
  );
};

export default CertificationsSection;
