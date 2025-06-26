import React from 'react';
import styles from './ContactSection.module.css';
import {
  SectionIconSize,
  ContactIconSize,
  ContactIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeIcon,
  GitHubIcon,
  LinkedInIcon
} from '../Icons';

const ContactSection = ({ contact }) => (
  <div className={styles.contactSection}>
     <h2 className="sectionTitle">
      <ContactIcon className={styles.icon} size={SectionIconSize} /> Contact
    </h2>
    <div className={styles.detail}>
      <MailIcon className={styles.icon} size={ContactIconSize} />
      <p className={styles.text}>{contact.email}</p>
    </div>
    <div className={styles.detail}>
      <PhoneIcon className={styles.icon} size={ContactIconSize} />
      <p className={styles.text}>{contact.phone}</p>
    </div>
    <div className={styles.detail}>
      <MapPinIcon className={styles.icon} size={ContactIconSize} />
      <p className={styles.text}>{contact.location}</p>
    </div>
    <div className={styles.detail}>
      <GlobeIcon className={styles.icon} size={ContactIconSize} />
      <a href={`http://${contact.website}`} target="_blank" rel="noopener noreferrer" className={styles.link}>{contact.website}</a>
    </div>
    <div className={styles.detail}>
      <GitHubIcon className={styles.icon} size={ContactIconSize} />
      <a href={`https://${contact.github}`} target="_blank" rel="noopener noreferrer" className={styles.link}>{contact.github}</a>
    </div>
    <div className={styles.detail}>
      <LinkedInIcon className={styles.icon} size={ContactIconSize} />
      <a href={`https://${contact.linkedin}`} target="_blank" rel="noopener noreferrer" className={styles.link}>{contact.linkedin}</a>
    </div>
  </div>
);

export default ContactSection;
