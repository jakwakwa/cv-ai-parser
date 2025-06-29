import {
  ContactTitleIcon,
  GitHubIcon,
  GlobeIcon,
  LinkedInIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from '../Icons';
import styles from './ContactSection.module.css';

interface Contact {
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
}

interface ContactSectionProps {
  contact: Contact;
  customColors: Record<string, string>;
}

const ContactSection = ({ contact, customColors }: ContactSectionProps) => (
  <section className={styles.contactSection}>
    <h2
      className={styles.sectionTitle}
      style={{ color: customColors['--charcoal'] }}
    >
      <ContactTitleIcon fill={customColors['--bronze-dark']} />
      Contact
    </h2>
    <div className={styles.contactDetails}>
      {contact.email && (
        <div className={styles.detail}>
          <MailIcon
            className={styles.icon}
            style={{ color: customColors['--teal-main'] }}
          />
          <a
            href={`mailto:${contact.email}`}
            className={styles.link}
            style={{ color: customColors['--coffee'] }}
          >
            {contact.email}
          </a>
        </div>
      )}
      {contact.phone && (
        <div className={styles.detail}>
          <PhoneIcon
            className={styles.icon}
            style={{ color: customColors['--teal-main'] }}
          />
          <span
            className={styles.text}
            style={{ color: customColors['--coffee'] }}
          >
            {contact.phone}
          </span>
        </div>
      )}
      {contact.location && (
        <div className={styles.detail}>
          <MapPinIcon
            className={styles.icon}
            style={{ color: customColors['--teal-main'] }}
          />
          <span
            className={styles.text}
            style={{ color: customColors['--coffee'] }}
          >
            {contact.location}
          </span>
        </div>
      )}
      {contact.linkedin && (
        <div className={styles.detail}>
          <LinkedInIcon
            className={styles.icon}
            style={{ color: customColors['--teal-main'] }}
          />
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            style={{ color: customColors['--coffee'] }}
          >
            LinkedIn
          </a>
        </div>
      )}
      {contact.github && (
        <div className={styles.detail}>
          <GitHubIcon
            className={styles.icon}
            style={{ color: customColors['--teal-main'] }}
          />
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            style={{ color: customColors['--coffee'] }}
          >
            GitHub
          </a>
        </div>
      )}
      {contact.website && (
        <div className={styles.detail}>
          <GlobeIcon
            className={styles.icon}
            style={{ color: customColors['--teal-main'] }}
          />
          <a
            href={contact.website}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            style={{ color: customColors['--coffee'] }}
          >
            Website
          </a>
        </div>
      )}
    </div>
  </section>
);

export default ContactSection;
