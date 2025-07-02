'use client';

import type React from 'react';
import { SiteHeader } from '@/src/components/site-header/SiteHeader';
import BackButton from '@/src/components/ui/BackButton';
import styles from './terms-and-conditions.module.css';

const TermsAndConditionsPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <SiteHeader />
      <div className={styles.textWhite}>
        <BackButton />
        <h1 className={styles.title}>Terms and Conditions</h1>
        <p className={styles.paragraph}>
          Welcome to airesumegen.com. These terms and conditions outline the
          rules and regulations for the use of airesumegen.com's Website,
          located at airesumegen.com.
        </p>

        <h2 className={styles.sectionTitle}>
          Intellectual Property Rights
        </h2>
        <p className={styles.paragraph}>
          Other than the content you own, which you may have opted to include on
          this Website, under these Terms, airesumegen.com and/or its licensors
          own all rights to the intellectual property and material contained in
          this Website, and all such rights are reserved.
        </p>

        <h2 className={styles.sectionTitle}>Restrictions</h2>
        <p className={styles.paragraph}>
          You are expressly and emphatically restricted from all of the
          following:
        </p>
        <ul className={styles.list}>
          <li>publishing any Website material in any media;</li>
          <li>
            selling, sublicensing and/or otherwise commercializing any Website
            material;
          </li>
          <li>publicly performing and/or showing any Website material;</li>
          <li>
            using this Website in any way that is or may be damaging to this
            Website;
          </li>
          <li>
            using this Website in any way that impacts user access to this
            Website;
          </li>
          <li>
            using this Website contrary to applicable laws and regulations, or
            in a way that causes, or may cause, harm to the Website, or to any
            person or business entity;
          </li>
          <li>
            engaging in any data mining, data harvesting, data extracting or any
            other similar activity in relation to this Website, or while using
            this Website;
          </li>
          <li>using this Website to engage in any advertising or marketing.</li>
        </ul>
        <p className={styles.paragraph}>
          Certain areas of this Website are restricted from access by you and
          airesumegen.com may further restrict access by you to any areas of
          this Website, at any time, in its sole and absolute discretion. Any
          user ID and password you may have for this Website are confidential
          and you must maintain confidentiality as well.
        </p>

        <h2 className={styles.sectionTitle}>No warranties</h2>
        <p className={styles.paragraph}>
          This Website is provided "as is," with all faults, and airesumegen.com
          makes no express or implied representations or warranties, of any kind
          related to this Website or the materials contained on this Website.
          Additionally, nothing contained on this Website shall be construed as
          providing consult or advice to you.
        </p>

        <h2 className={styles.sectionTitle}>
          Limitation of liability
        </h2>
        <p className={styles.paragraph}>
          In no event shall airesumegen.com, nor any of its officers, directors
          and employees, be liable to you for anything arising out of or in any
          way connected with your use of this Website, whether such liability is
          under contract, tort or otherwise, and airesumegen.com, including its
          officers, directors and employees shall not be liable for any
          indirect, consequential or special or exemplary damages arising out of
          or in any way related to your use of this Website.
        </p>

        <h2 className={styles.sectionTitle}>Indemnification</h2>
        <p className={styles.paragraph}>
          You hereby indemnify to the fullest extent airesumegen.com from and
          against any and/or all liabilities, costs, demands, causes of action,
          damages and expenses arising in any way related to your breach of any
          of the provisions of these Terms.
        </p>

        <h2 className={styles.sectionTitle}>Severability</h2>
        <p className={styles.paragraph}>
          If any provision of these Terms is found to be unenforceable or
          invalid under any applicable law, such unenforceability or invalidity
          shall not render these Terms unenforceable or invalid as a whole, and
          such provisions shall be deleted without affecting the remaining
          provisions herein.
        </p>

        <h2 className={styles.sectionTitle}>Variation of Terms</h2>
        <p className={styles.paragraph}>
          airesumegen.com is permitted to revise these Terms at any time as it
          sees fit, and by using this Website you are expected to review such
          Terms on a regular basis to ensure you understand all terms and
          conditions governing use of this Website.
        </p>

        <h2 className={styles.sectionTitle}>Assignment</h2>
        <p className={styles.paragraph}>
          airesumegen.com shall be permitted to assign, transfer, and
          subcontract its rights and/or obligations under these Terms without
          any notification or consent required. However, you shall not be
          permitted to assign, transfer, or subcontract any of your rights
          and/or obligations under these Terms.
        </p>

        <h2 className={styles.sectionTitle}>Entire Agreement</h2>
        <p className={styles.paragraph}>
          These Terms, including any legal notices and disclaimers contained on
          this Website, constitute the entire agreement between airesumegen.com
          and you in relation to your use of this Website, and supersede all
          prior agreements and understandings with respect to the same.
        </p>

        <h2 className={styles.sectionTitle}>
          Governing Law & Jurisdiction
        </h2>
        <p className={styles.paragraph}>
          These Terms will be governed by and construed in accordance with the
          laws of the State of South Africa, and you submit to the non-exclusive
          jurisdiction of the state and federal courts located in South Africa
          for the resolution of any disputes.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
