import React from 'react';
import styles from './EducationSection.module.css';
import { EducationIcon, SectionIconSize } from '../Icons';

const EducationSection = ({ education }) => (
  <div className={styles.educationSection}>
    <h2 className="sectionTitle">
      <EducationIcon className={styles.icon} size={SectionIconSize} /> Education
    </h2>
    {education.map((edu, index) => (
      <div key={index} className="mb-4">
      
        <p className="subject">{edu.degree}</p>
          <p className="issuer"> {edu.institution}</p>
        {edu.duration && <p className="date">{edu.duration}</p>}

      </div>
    ))}
  </div>
);

export default EducationSection;
