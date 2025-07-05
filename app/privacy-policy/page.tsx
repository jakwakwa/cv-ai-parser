'use client';

import type React from 'react';
import { SiteHeader } from '@/src/components/site-header/SiteHeader';
import BackButton from '@/src/components/ui/BackButton';
import styles from '../page.module.css';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      <SiteHeader />
      <div className="container mx-auto p-4 max-w-4xl flex-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <BackButton />
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Privacy Policy</h1>
        <p className="mb-2">
          This Privacy Policy describes how your personal information is
          collected, used, and shared when you visit or make a purchase from
          airesumegen.com (the "Site").
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">
          Personal Information We Collect
        </h2>
        <p className="mb-2">
          When you visit the Site, we automatically collect certain information
          about your device, including information about your web browser, IP
          address, time zone, and some of the cookies that are installed on your
          device. Additionally, as you browse the Site, we collect information
          about the individual web pages or products that you view, what
          websites or search terms referred you to the Site, and information
          about how you interact with the Site. We refer to this
          automatically-collected information as "Device Information."
        </p>
        <p className="mb-2">
          We collect Device Information using the following technologies:
        </p>
        <ul className="list-disc list-inside ml-4">
          <li>
            "Cookies" are data files that are placed on your device or computer
            and often include an anonymous unique identifier. For more
            information about cookies, and how to disable cookies, visit
            http://www.allaboutcookies.org.
          </li>
          <li>
            "Log files" track actions occurring on the Site, and collect data
            including your IP address, browser type, Internet service provider,
            referring/exit pages, and date/time stamps.
          </li>
          <li>
            "Web beacons," "tags," and "pixels" are electronic files used to
            record information about how you browse the Site.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">
          How We Use Your Personal Information
        </h2>
        <p className="mb-2">
          We use the Device Information that we collect to help us screen for
          potential risk and fraud (in particular, your IP address), and more
          generally to improve and optimize our Site (for example, by generating
          analytics about how our customers browse and interact with the Site,
          and to assess the success of our marketing and advertising campaigns).
          We also utilize Google AdSense and other third-party advertising
          partners to serve ads on our site, which may use cookies and similar
          technologies to collect information about your browsing activities to
          provide you with personalized advertisements.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">Changes</h2>
        <p className="mb-2">
          We may update this privacy policy from time to time in order to
          reflect, for example, changes to our practices or for other
          operational, legal or regulatory reasons.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">Contact Us</h2>
        <p className="mb-2">
          For more information about our privacy practices, if you have
          questions, or if you would like to make a complaint, please contact us
          by e-mail at jakwakwa@gmail.com.
        </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
