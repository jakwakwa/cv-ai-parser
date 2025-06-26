import React from 'react';
import styles from './SkillsSection.module.css';
import { SkillsIcon, SectionIconSize } from '../Icons';

const SkillsSection = ({ skills }) => (
  <div className={styles.skillsSection}>
    <h2 className="sectionTitle">
      <SkillsIcon className={styles.icon} size={SectionIconSize} /> Skills
    </h2>
    <div>
      {skills.map((skill, index) => (
        <span key={index} className={styles.skill}>
          {skill}
        </span>
      ))}
    </div>
  </div>
);

export default SkillsSection;
