import React from 'react';
import styles from './ExperienceSection.module.css';
import './avoidBreak.css';

const ExperienceSection = ({ experience }) => (
  <section className={styles.experienceSection}>
    <h2 className="sectionTitle">
      Experience
    </h2>
    {experience.map((job, index) => (
      <div key={index} className="avoid-break">
        <h3 className={styles.jobTitle}>{job.title}</h3>
        <p className={styles.company}>{job.company}</p>
        <p className={styles.duration}>{job.duration}</p>
        <ul className={styles.details}>
          {job.details.map((detail, idx) => (
            <li key={idx} className={styles.detailItem + " bullet-point content-body"}>
              {detail}
            </li>
          ))}
        </ul>
      </div>
    ))}
  </section>
);

export default ExperienceSection;
