import React from 'react';
import type { ParsedResume } from '@/lib/resume-parser/schema';
import styles from './FigmaResumeResume.module.css';

export const FigmaResumeResume: React.FC<{ resume: ParsedResume }> = ({ resume }) => {
  return (
    <div className={styles.resume}><div className={styles.header}><div className={styles.profile}><div className={styles['profile-image']}></div></div>
<div className={styles.summary}><div className={styles.summary}><p>{`CURRICULUM VITAE
JOHN DOE


I am an experienced frontend engineer situated in marvellous Cape Town, I am proud to be able to say that I'm a unicorn - skilled both as a frontend software developer/engineer and then I'm also a qualified and vastly experienced UI/UX Designer.My tech preference includes working with frameworks/libraries like or similar to ReactJs. I have more than 4 years of experience in JavaScript and Typescript, then add to that I can also boast that I am highly skilled in creating UI Design Systems ( Extensive and scalable UI Libraries ).`}</p></div></div></div>
<div className={styles.body}><div className={styles.experience}><div className={styles.sectiontitle}><p>{`Experience`}</p></div>
<div className={styles['experience-list']}><div className={styles['experience-item']}><div className={styles['exp-title']}><p>{resume.title}</p></div>
<div className={styles['exp-company']}><p>{`Company`}</p></div>
<div className={styles['exp-period']}><p>{`period`}</p></div>
<div className={styles['exp-desc']}><p>{`I am an experienced frontend engineer situated in marvellous Cape Town, I am proud to be able to say that I'm a unicorn - skilled both as a frontend software developer/engineer and then I'm also a qualified and `}</p></div></div>
<div className={styles['experience-item']}><div className={styles['exp-title']}><p>{resume.title}</p></div>
<div className={styles['exp-company']}><p>{`Company`}</p></div>
<div className={styles['exp-period']}><p>{`period`}</p></div>
<div className={styles['exp-desc']}><p>{`I am an experienced frontend engineer situated in marvellous Cape Town, I am proud to be able to say that I'm a unicorn - skilled both as a frontend software developer/engineer and then I'm also a qualified and `}</p></div></div>
<div className={styles['experience-item']}><div className={styles['exp-title']}><p>{resume.title}</p></div>
<div className={styles['exp-company']}><p>{`Company`}</p></div>
<div className={styles['exp-period']}><p>{`period`}</p></div>
<div className={styles['exp-desc']}><p>{`I am an experienced frontend engineer situated in marvellous Cape Town, I am proud to be able to say that I'm a unicorn - skilled both as a frontend software developer/engineer and then I'm also a qualified and `}</p></div></div>
<div className={styles['experience-item']}><div className={styles['exp-title']}><p>{resume.title}</p></div>
<div className={styles['exp-company']}><p>{`Company`}</p></div>
<div className={styles['exp-period']}><p>{`period`}</p></div>
<div className={styles['exp-desc']}><p>{`I am an experienced frontend engineer situated in marvellous Cape Town, I am proud to be able to say that I'm a unicorn - skilled both as a frontend software developer/engineer and then I'm also a qualified and `}</p></div></div></div></div>
<div className={styles.sidebar}><div className={styles.sectiontitle}><p>{`Contact`}</p></div>
<div className={styles.contact}><div className={styles['contact-list']}><p>{resume.contact?.email}</p>
<p>{resume.contact?.phone}</p>
<p>{`location`}</p></div></div>
<div className={styles.sectiontitle}><p>{`Education`}</p></div>
<div className={styles.education}><div className={styles['education-list']}><p>{`Degree`}</p>
<p>{`School`}</p>
<p>{`year`}</p></div>
<div className={styles['education-list']}><p>{`Degree`}</p>
<p>{`School`}</p>
<p>{`year`}</p></div></div>
<div className={styles.sectiontitle}><p>{`Certification`}</p></div>
<div className={styles.certification}><div className={styles['certification-list']}><p>{`Degree`}</p>
<p>{`School`}</p>
<p>{`year`}</p></div></div>
<div className={styles.sectiontitle}><p>{`Skills`}</p></div>
<div className={styles.skills}><div className={styles['skills-list']}><div className={styles.skill}><p>{`skill`}</p></div></div></div></div></div></div>
  );
};
