'use client';

import type React from 'react';
import { SiteHeader } from '@/src/components/site-header/site-header';
import BackButton from '@/src/components/ui/BackButton';
import styles from './page.module.css';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      <SiteHeader />
      <div className="container mx-auto p-4 max-w-4xl flex-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <BackButton />
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            Privacy Policy
          </h1>
          <p className="mb-2">
            This Privacy Policy describes how your personal information is
            collected, used, and shared when you visit or make a purchase from
            airesumegen.com (the "Site").
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">
            Personal Information We Collect
          </h2>
          <p className="mb-2">
            When you visit the Site, we automatically collect certain
            information about your device, including information about your web
            browser, IP address, time zone, and some of the cookies that are
            installed on your device. Additionally, as you browse the Site, we
            collect information about the individual web pages or products that
            you view, what websites or search terms referred you to the Site,
            and information about how you interact with the Site. We refer to
            this automatically-collected information as "Device Information."
          </p>
          <p className="mb-2">
            We collect Device Information using the following technologies:
          </p>
          <ul className="list-disc list-inside ml-4">
            <li>
              "Cookies" are data files that are placed on your device or
              computer and often include an anonymous unique identifier. For
              more information about cookies, and how to disable cookies, visit
              http://www.allaboutcookies.org.
            </li>
            <li>
              "Log files" track actions occurring on the Site, and collect data
              including your IP address, browser type, Internet service
              provider, referring/exit pages, and date/time stamps.
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
            generally to improve and optimize our Site (for example, by
            generating analytics about how our customers browse and interact
            with the Site, and to assess the success of our marketing and
            advertising campaigns).
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">
            Third-Party Advertising and Data Collection
          </h2>
          <p className="mb-4">
            We use Google AdSense and other third-party advertising services to
            display advertisements on our website. These services may collect
            and use information about your visits to this and other websites in
            order to provide advertisements about goods and services of interest
            to you.
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-700">
            Google AdSense
          </h3>
          <p className="mb-2">
            Google AdSense is a third-party advertising service provided by
            Google LLC. Google uses cookies and similar technologies to:
          </p>
          <ul className="list-disc list-inside ml-4 mb-4">
            <li>
              Serve ads based on a user's prior visits to our website or other
              websites
            </li>
            <li>Serve ads based on a user's interests and demographics</li>
            <li>Measure the effectiveness of ads</li>
            <li>Prevent showing ads the user has already seen</li>
            <li>Ensure ads are displayed properly</li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-700">
            DoubleClick Cookies
          </h3>
          <p className="mb-4">
            Google's use of advertising cookies enables it and its partners to
            serve ads to you based on your visit to our site and/or other sites
            on the Internet. Google may use DoubleClick cookies to serve ads
            across the web and analyze website traffic.
          </p>

          <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-700">
            Your Choices and Opt-Out Options
          </h3>
          <p className="mb-2">
            You have several options to control or limit how Google and our
            advertising partners collect and use your information:
          </p>
          <ul className="list-disc list-inside ml-4 mb-4">
            <li>
              <strong>Google Ads Settings:</strong> You can manage your Google
              Ads preferences and opt out of personalized advertising by
              visiting{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Google Ads Settings
              </a>
            </li>
            <li>
              <strong>Network Advertising Initiative:</strong> You can opt out
              of many third-party advertising networks at{' '}
              <a
                href="https://www.networkadvertising.org/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                NAI Opt-Out
              </a>
            </li>
            <li>
              <strong>Digital Advertising Alliance:</strong> Visit{' '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                DAA WebChoices
              </a>{' '}
              to opt out of interest-based advertising
            </li>
            <li>
              <strong>Browser Settings:</strong> You can configure your browser
              to block or delete cookies, though this may affect website
              functionality
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-700">
            Third-Party Privacy Policies
          </h3>
          <p className="mb-2">
            Our advertising partners have their own privacy policies. We
            encourage you to review them:
          </p>
          <ul className="list-disc list-inside ml-4 mb-4">
            <li>
              <strong>Google Privacy Policy:</strong>{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                https://policies.google.com/privacy
              </a>
            </li>
            <li>
              <strong>Google AdSense Privacy Policy:</strong>{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                https://policies.google.com/technologies/ads
              </a>
            </li>
          </ul>

          <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-700">
            International Users and GDPR
          </h3>
          <p className="mb-4">
            If you are located in the European Economic Area (EEA), you have
            certain rights under the General Data Protection Regulation (GDPR),
            including the right to access, update, or delete your personal
            information. For advertising-related data processed by Google, you
            can exercise these rights through Google's privacy controls and
            contact Google directly regarding their data processing practices.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">
            Data Retention
          </h2>
          <p className="mb-4">
            We retain your personal information for as long as necessary to
            provide our services and comply with legal obligations. Advertising
            partners like Google have their own data retention policies, which
            you can find in their respective privacy policies linked above.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">
            Changes
          </h2>
          <p className="mb-2">
            We may update this privacy policy from time to time in order to
            reflect, for example, changes to our practices or for other
            operational, legal or regulatory reasons.
          </p>

          <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-800">
            Contact Us
          </h2>
          <p className="mb-2">
            For more information about our privacy practices, if you have
            questions, or if you would like to make a complaint, please contact
            us by e-mail at jakwakwa@gmail.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
