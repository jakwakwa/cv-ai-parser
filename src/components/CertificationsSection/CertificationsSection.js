import styles from './CertificationsSection.module.css';
import { CertificationsIcon, SectionIconSize } from '../Icons';

const CertificationsSection = ({ certifications }) => {
    return (
        <section className={styles.certificationsSection}>
            <h2 className="sectionTitle">
                <CertificationsIcon className={styles.icon} size={SectionIconSize} />
                Certifications
            </h2>
            <div className={styles.certificationsList}>
                {certifications && certifications.length > 0 ? certifications.map((cert, index) => (
                    <div key={index} className={styles.certificationItem}>
                        <p className="subject">{cert.name}</p>
                        <p className="issuer">{cert.issuer}</p>
                        {cert.date && <p className="date">{cert.date}</p>}
                        {cert.id && <p className={styles.credentialId}>Credential ID: {cert.id}</p>}
                    </div>
                )) : <p className={styles.noCerts}>No certifications listed.</p>}
            </div>
        </section>
    );
};

export default CertificationsSection;
