import React, { useEffect } from 'react';

// Icons using simplified SVG paths for "thin line" style
// Section title icons will now be rendered at a uniform size of 20px.
const SectionIconSize = 20;
// Contact detail icons will now be rendered at a uniform, smaller size (e.g., 16px).
const ContactIconSize = 16;
// Common stroke width for thin line effect
const ThinStrokeWidth = 1.5;

// Updated Contact Icon (Chat Bubble User)
const ContactIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M14.58,11.3a3.24,3.24,0,0,0,.71-2,3.29,3.29,0,0,0-6.58,0,3.24,3.24,0,0,0,.71,2,5,5,0,0,0-2,2.31,1,1,0,1,0,1.84.78A3,3,0,0,1,12,12.57h0a3,3,0,0,1,2.75,1.82,1,1,0,0,0,.92.61,1.09,1.09,0,0,0,.39-.08,1,1,0,0,0,.53-1.31A5,5,0,0,0,14.58,11.3ZM12,10.57h0a1.29,1.29,0,1,1,1.29-1.28A1.29,1.29,0,0,1,12,10.57ZM18,2H6A3,3,0,0,0,3,5V16a3,3,0,0,0,3,3H8.59l2.7,2.71A1,1,0,0,0,12,22a1,1,0,0,0,.65-.24L15.87,19H18a3,3,0,0,0,3-3V5A3,3,0,0,0,18,2Zm1,14a1,1,0,0,1-1,1H15.5a1,1,0,0,0-.65.24l-2.8,2.4L9.71,17.29A1,1,0,0,0,9,17H6a1,1,0,0,1-1-1V5A1,1,0,0,1,6,4H18a1,1,0,0,1,1,1Z"></path>
  </svg>
);

const MailIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ThinStrokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
    <path d="M3 7L12 13L21 7"></path>
  </svg>
);

const PhoneIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ThinStrokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0,0,0,6 6l1.27-1.27a2 2 0,0,1 2.11-.45 12.84 12.84 0,0,0 2.81.7A2 2 0,0,1 22 16.92z"></path>
  </svg>
);

const MapPinIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ThinStrokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
    <circle cx="12" cy="9" r="3"></circle>
  </svg>
);

const GlobeIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ThinStrokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const EducationIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.49,10.19l-1-.55h0l-9-5-.11,0a1.06,1.06,0,0,0-.19-.06l-.19,0-.18,0a1.17,1.17,0,0,0-.2.06l-.11,0-9,5a1,1,0,0,0,0,1.74L4,12.76V17.5a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V12.76l2-1.12V14.5a1,1,0,0,0,2,0V11.06A1,1,0,0,0,21.49,10.19ZM16,17.5a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V13.87l4.51,2.5.15.06.09,0a1,1,0,0,0,.25,0h0a1,1,0,0,0,.25,0l.09,0a.47.47,0,0,0,.15-.06L16,13.87Zm-5-3.14L4.06,10.5,11,6.64l6.94,3.86Z"></path>
  </svg>
);

const CertificationsIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.87,17.25l-2.71-4.68A6.9,6.9,0,0,0,19,9.25a7,7,0,0,0-14,0,6.9,6.9,0,0,0,.84,3.32L3.13,17.25A1,1,0,0,0,4,18.75l2.87,0,1.46,2.46a1,1,0,0,0,.18.22,1,1,0,0,0,.69.28h.14a1,1,0,0,0,.73-.49L12,17.9l1.93,3.35a1,1,0,0,0,.73.48h.14a1,1,0,0,0,.7-.28.87.87,0,0,0,.17-.21l1.46-2.46,2.87,0a1,1,0,0,0,.87-.5A1,1,0,0,0,20.87,17.25ZM9.19,18.78,8.3,17.29a1,1,0,0,0-.85-.49l-1.73,0,1.43-2.48a7,7,0,0,0,3.57,1.84ZM12,14.25a5,5,0,1,1,5-5A5,5,0,0,1,12,14.25Zm4.55,2.55a1,1,0,0,0-.85.49l-.89,1.49-1.52-2.65a7.06,7.06,0,0,0,3.56-1.84l1.43,2.48Z"></path>
  </svg>
);

const SkillsIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M21,2a1,1,0,0,0-1,1V6H16V5a1,1,0,0,0-2,0V6H12V5a1,1,0,0,0-2,0V6H8V5A1,1,0,0,0,6,5V6H4V3A1,1,0,0,0,2,3V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V3A1,1,0,0,0,21,2ZM20,19a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V16H6v1a1,1,0,0,0,2,0V16h2v1a1,1,0,0,0,2,0V16h4v1a1,1,0,0,0,2,0V16h2Zm0-5H18V13a1,1,0,0,0-2,0v1H12V13a1,1,0,0,0-2,0v1H8V13a1,1,0,0,0-2,0v1H4V8H6V9A1,1,0,0,0,8,9V8h2V9a1,1,0,0,0,2,0V8h2V9a1,1,0,0,0,2,0V8h4Z"></path>
  </svg>
);

// Updated GitHub Icon with new SVG path and fill set to currentColor
const GitHubIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="github" width={props.size} height={props.size} fill="currentColor">
    <path d="M12,2.2467A10.00042,10.00042,0,0,0,8.83752,21.73419c.5.08752.6875-.21247.6875-.475,0-.23749-.01251-1.025-.01251-1.86249C7,19.85919,6.35,18.78423,6.15,18.22173A3.636,3.636,0,0,0,5.125,16.8092c-.35-.1875-.85-.65-.01251-.66248A2.00117,2.00117,0,0,1,6.65,17.17169a2.13742,2.13742,0,0,0,2.91248.825A2.10376,2.10376,0,0,1,10.2,16.65923c-2.225-.25-4.55-1.11254-4.55-4.9375a3.89187,3.89187,0,0,1,1.025-2.6875,3.59373,3.59373,0,0,1,.1-2.65s.83747-.26251,2.75,1.025a9.42747,9.42747,0,0,1,5,0c1.91248-1.3,2.75-1.025,2.75-1.025a3.59323,3.59323,0,0,1,.1,2.65,3.869,3.869,0,0,1,1.025,2.6875c0,3.83747-2.33752,4.6875-4.5625,4.9375a2.36814,2.36814,0,0,1,.675,1.85c0,1.33752-.01251,2.41248-.01251,2.75,0,.26251.1875.575.6875.475A10.0053,10.0053,0,0,0,12,2.2467Z"></path>
  </svg>
);

// Updated LinkedIn Icon with new SVG path and fill set to currentColor
const LinkedInIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="linkedin" width={props.size} height={props.size} fill="currentColor">
    <path d="M20.47,2H3.53A1.45,1.45,0,0,0,2.06,3.43V20.57A1.45,1.45,0,0,0,3.53,22H20.47a1.45,1.45,0,0,0,1.47-1.43V3.43A1.45,1.45,0,0,0,20.47,2ZM8.09,18.74h-3v-9h3ZM6.59,8.48h0a1.56,1.56,0,1,1,0-3.12,1.57,1.57,0,1,1,0,3.12ZM18.91,18.74h-3V13.91c0-1.21-.43-2-1.52-2A1.65,1.65,0,0,0,12.85,13a2,2,0,0,0-.1.73v5h-3s0-8.18,0-9h3V11A3,3,0,0,1,15.46,9.5c2,0,3.45,1.29,3.45,4.06Z"></path>
  </svg>
);


const App = () => {
  const resumeData = {
    name: "JACO KOTZEE",
    title: "Frontend Engineer + UI Designer",
    contact: {
      email: "jakwakwa@gmail.com",
      phone: "+27 76 341 0291",
      location: "Cape Town, South Africa",
      website: "www.jacofrontend.dev",
      github: "github.com/jakwakwa", 
      linkedin: "linkedin.com/in/jacobkotzee"
    },
    summary: "As a seasoned frontend engineer based in the picturesque city of Cape Town, I take pride in my unique qualifications. Not only am I adept as a frontend software developer and engineer, but I also possess highly refined skills as a UI/UX designer.",
    experience: [
      {
        title: "Freelance Engineer & UI Designer",
        company: "jacofrontend.dev",
        duration: "Jun 2024 to Present",
        details: [
          "Designing and developing high-performance Jamstack websites using React.js frameworks (Gatsby and Next.js).",
          "Creating fast, secure, and engaging user experiences for a variety of clients."
        ]
      },
      {
        title: "Frontend Engineer",
        company: "7secondSolar",
        duration: "Sep 2023 - May 2024",
        details: [
          "Collaborated with the AUTOPVT™ back-end development team as well as UX/UI teams to design, develop, and implement new features.",
          "Identified a critical vulnerability in the inherited front-end architecture (GraphQL & SST) which posed a significant risk to our small, relatively inexperienced development team due to its complexity and reliance on niche technologies.",
          "Took the initiative to refactor critical sections of the front-end, replacing the complex GraphQL & SST setup with a more maintainable and accessible architecture utilizing standard fetch patterns in React with TypeScript.",
          "This strategic decision resulted in a [quantified cost reduction, e.g., 15%] decrease in AWS service expenses and, more importantly, empowered the less experienced development team to confidently manage and maintain the front-end codebase.",
          "Actively participated in code reviews, providing valuable feedback to team members, and actively contributing to the continuous improvement of the codebase.",
          "Dedicated to staying up-to-date with the latest advancements in front-end and back-end technologies, ensuring a solid understanding of current trends and innovations.",
          "Actively involved in mentoring junior developers, sharing my knowledge and experience, and fostering a collaborative and supportive learning environment within the team."
        ]
      },
      {
        title: "Frontend Engineer",
        company: "Ace Secure (The Netherlands)",
        duration: "Feb 2023 - Aug 2023",
        details: [
          "Solely responsible for all Frontend and UI design work for the development of an eLearning platform P.O.C., ensuring a visually appealing, user-friendly, responsive, and accessible interface.",
          "Conducted thorough research and analysis of existing eLearning platforms to identify best practices and user preferences.",
          "Created detailed UI mockups and wireframes to illustrate the platform's layout, navigation, and key features.",
          "Implemented the UI design using Next.js, ensuring visual appeal and consistency across all pages.",
          "Integrated quizzes and video learning features into the platform, ensuring engaging and interactive learning experiences.",
          "Conducted regular testing to ensure proper platform functioning and address any bugs or issues.",
          "Held weekly update meetings with the client to review project progress, present design concepts, and discuss challenges.",
          "Provided detailed status reports, including screenshots and demos, to keep the client informed of platform development.",
          "Incorporated feedback from the client into the design and development process, ensuring the final product met their expectations and requirements."
        ]
      },
      {
        title: "Frontend Engineer",
        company: "Ditto Hire / Ditto Jobs",
        duration: "Jun 2021 - Nov 2022",
        details: [
          "Spearheaded the development of the Ditto Jobs Design System, a comprehensive framework encompassing reusable components, design guidelines, and rapid prototyping tools, significantly improving design consistency and development efficiency.",
          "Led the front-end team, including two remote engineers, fostering their skills and collaboration, and mentored a new UI/UX designer in design system creation and Figma best practices.",
          "Initiated the codebase for the Talent Solutions CMS feature within the Ditto Jobs Design System, enabling efficient management of potential candidates.",
          "Led the revamp of Ditto Jobs's UI design by establishing a Figma library for design teams, ensuring a unified design language across all platforms.",
          "Created a streamlined development workflow integrating Figma, Zeplin, Storybook, and Next.js, facilitating efficient translation of designs into code and ensuring consistency.",
          "Took ownership of managing the Figma library as the single source of truth for design elements, ensuring the integrity of existing design screens.",
          "Contributed to the creation and implementation of management processes, improving team efficiency and workflow."
        ]
      },
      {
        title: "Freelance Web Developer",
        company: "jacofrontend.dev · Freelance",
        details: [
          "Focused on smaller private freelance client work and extensive learning of advanced React.js features (e.g., hooks).",
          "Built real-world HTML, CSS, and JavaScript challenges using frontendmentor.io, showcasing coding ability and comprehension of modern frontend tools like styled-components, Parcel, and TypeScript."
        ]
      },
      {
        title: "UX Engineer",
        company: "Capitec Bank",
        duration: "Feb 2020 - Nov 2020",
        details: [
          "Joined Capitec's Business Solutions department, working in a fast-paced  environment to solve problems for their mobile banking application.",
          "Developed with HTML, CSS, and JavaScript, leveraging the Kendo UI library.",
          "Added accessibility scripts for the mobile banking app to improve usability for all customers.",
          "Worked on UX/UI component requirements, ensuring a user-friendly interface.",
          "Utilised a prototyping tool to generate code for front-end developers, empowering the UX team to maintain control over component design and enabling the front-end team to concentrate on business logic and data integration.",
          "Adhered to Agile and Scrum methodologies.",
          "Collaborated with Business Analysts and Test Analysts to ensure smooth project delivery.",
          "Conducted testing on devices to ensure optimal performance."
        ]
      },
      {
        title: "Frontend Developer & UI Designer",
        company: "Span Digital",
        duration: "Jun 2018 - Jan 2020",
        details: [
          "Thrived in a highly talented and experienced team environment, contributing to an internal web-based application for leading Silicon Valley enterprises.",
          "Gained initial experience with React and Redux, predominantly written in TypeScript, working closely with a senior developer.",
          "Created and managed design systems for an internal product, ensuring consistency and efficiency.",
          "Collaborated on an internal web application built with React, gaining exposure to ReasonML.",
          "Supported internal brand design initiatives through UI design contributions.",
          "Researched and implemented workflows using Figma and the Figma Web API to streamline collaboration between designers and developers."
        ]
      },
      {
        title: "Frontend Developer (Contract)",
        company: "Responsive Digital",
        duration: "Jan 2018 - May 2018",
        details: [
          "Focused on learning and enhancing skills in Angular 2.",
          "Used HTML, CSS, and jQuery to implement concepts for a digital magazine pitched to major South African brands."
        ]
      },
      {
        title: "Web Development (Contract)",
        company: "Brandfoundry",
        duration: "Oct 2017 - Dec 2017",
        details: [
          "Actively contributed to a large-scale, ongoing internal software revamp project for Old Mutual, collaborating with a dedicated team to enhance and modernise existing software infrastructure."
        ]
      },
      {
        title: "Web Development (Contract)",
        company: "StratCol Ltd",
        duration: "Mar 2017 - Sep 2017",
        details: [
          "Designed and developed a new WordPress website, aligning it with the corporate identity previously created in 2015."
        ]
      },
      {
        title: "UI Development & Design",
        company: "IO Digital",
        duration: "Jan 2014 - Feb 2017",
        details: [
          "Contributed to the conceptualisation, design, development, and scaling of innovative and impactful digital products.",
          "Led UI design for the majority of projects, ensuring user-centred and aesthetically pleasing interfaces.",
          "Developed the front-end for all projects, writing maintainable, scalable, responsive, and cross-browser compatible code using CSS, HTML, JavaScript, and jQuery.",
          "Assisted the Head of Design in a design and advisory capacity, providing support and expertise."
        ]
      },
    ],
    education: [
      {
        degree: "B. Tech Multimedia",
        institution: "Tshwane University of Technology",
        duration: "Sep 2006 - May 2009",

      },
      {
        degree: "High School Diploma", // Added for clarity
        institution: "Montana High School",
        note: "Distinction in Computer Studies"
    
      }
    ],
    certifications: [
      {
        name: "React",
        issuer: "Codecademy",
        date:"November 14, 2024"
      },
         {
        name: "TypeScript: Fundamentals",
        issuer: "Codecademy",
          date:"September 15, 2024"
      }
    ],
    skills: [
      "Frontend Development", "UI/UX Design", "Design Systems", "Collaboration",
      "Problem Solving", "Mentorship", "English", "Afrikaans",
      "React.js", "Next.js", "CSS", "TypeScript", "Zustand", 
      "Postgres Database", "Prisma ORM", "Clientside GraphQL"
    ],
    profileImage: "https://images.ctfassets.net/lux2yle27o2x/U3SK6xjRhpQRa9vJy8nyM/ae72bcc8d7e06a1679c014d9f9fffa06/Hero-2.jpg.png?w=628&h=628&q=50&fm=webp"
  };

  // Define colors as CSS variables for easier management and consistency
  // These colors are now explicitly used within the component for styling
  const colors = {
    '--mint-light': '#d8b08c',
    '--teal-dark': '#1f3736',
    '--charcoal': '#565854',
    '--mint-background': '#c4f0dc',
    '--bronze-dark': '#a67244',
    '--peach': '#f9b87f',
    '--coffee': '#3e2f22',
    '--teal-main': '#116964',
    '--light-grey-background': '#f5f5f5', 
    '--off-white': '#faf4ec', // Added for the left column background
    '--light-brown-border': '#a49990c7', // Adjusted border color based on visual
    '--light-grey-border': '#cecac6' // Adjusted border color for experience section
  };

  // Use useEffect to dynamically load the html2pdf.js script
  useEffect(() => {
    const scriptId = 'html2pdf-script';
    // Check if the script is already loaded to prevent multiple loads
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.async = true; // Load script asynchronously
      document.body.appendChild(script);

      // Optional: Clean up the script when the component unmounts
      // For a top-level app, this might not be strictly necessary but is good practice.
      return () => {
        const existingScript = document.getElementById(scriptId);
        if (existingScript) {
          existingScript.remove();
        }
      };
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleDownloadPdf = () => {
    // Get the element to be converted to PDF. This is the main content of your resume.
    const element = document.getElementById('resume-content');
    if (element) {
      // Options for html2pdf
      const options = {
        margin: 10, // Margin in mm
        filename: 'Jaco_Kotzee_Resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true }, // Added useCORS: true here
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Ensure html2pdf is loaded before attempting to use it
      if (window.html2pdf) {
        window.html2pdf().from(element).set(options).save();
      } else {
        console.error("html2pdf.js not loaded. Please ensure the script tag is present and loaded.");
        // Fallback message for the user if the library isn't loaded
        alert("PDF generation library not loaded. Please try again or use your browser's print to PDF function (Ctrl+P/Cmd+P).");
      }
    } else {
      console.error("Resume content element not found!");
    }
  };

  return (
    <div className="font-sans antialiased min-h-screen p-4 sm:p-8 flex flex-col items-center justify-center" style={{ backgroundColor: colors['--mint-background'] }}>
      {/* Moved html2pdf.js script loading to useEffect hook for proper loading */}
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500;700&display=swap');
          body {
            font-family: 'DM Sans', sans-serif;
          }
          .bullet-point::before {
            content: '•';
            color: ${colors['--teal-main']};
            font-weight: bold;
            display: inline-block;
            width: 1em;
            margin-left: -1em;
          }
          /* Custom styles for image fallback/error */
          .profile-image-frame {
            width: 96px;
            height: 96px;
            border-radius: 9999px; /* Make it circular */
            overflow: hidden; /* Clip content outside the circle */
            margin: 0 auto 1rem; /* Center horizontally and add bottom margin */
            display: flex; /* Use flexbox to center image vertically/horizontally */
            align-items: center;
            justify-content: center;
            background-color: ${colors['--mint-light']}; /* This is the "ring" color / background of the frame */
          }
          .profile-image {
            width: 90%; /* Make image fill frame width */
            height: auto; /* Make image fill frame height */
            object-fit: cover; 
            border-radius: 9999px; /* Ensure the image itself is also circular */
          }
          /* Custom font styles for specific elements */
          .font-dm-mono-subheading {
            letter-spacing: 0.1rem;
            font-family: 'DM Mono', Menlo, monospace;
            font-weight: 500;
          }
          .font-dm-mono-degree {
            letter-spacing: 0.05rem;
            font-family: 'DM Mono', Menlo, monospace;
            font-weight: 600;
            font-size: 0.7rem;
            opacity: 0.8; /* Adjusted opacity here for consistency */
          }
          .font-dm-mono-edu-detail {
            font-family: 'DM Mono', Menlo, monospace;
            font-weight: 400;
            font-size: 0.65rem;
            margin-top: 0.1rem;
            opacity: 0.95; /* Adjusted opacity here for consistency */
          }
          .font-dm-mono-header {
            letter-spacing: 0.1rem;
            font-family: 'DM Mono', Menlo, monospace;
            margin-bottom: 3px;
          }
          .font-dm-sans-experience-title {
            font-family: 'DM Sans', sans-serif;
            font-size: 1.1rem;
            font-weight: 500;
            margin-top: 2rem !important; /* Kept important as per original for spacing */
          }
          .content-body {
            color: #535c5b; /* Using hardcoded value as it's not in color palette */
            font-size: 0.9rem;
          }
        `}
      </style>
      
      {/* Download PDF Button */}
      <button 
        onClick={handleDownloadPdf}
        className="mb-4 px-6 py-2 rounded-lg text-white font-bold transition-all duration-300 ease-in-out transform hover:scale-105"
        style={{
          background: colors['--teal-main'], // Use teal color for button
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: `1px solid ${colors['--teal-dark']}`
        }}
      >
        Download as PDF
      </button>

      <div id="resume-content" className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-4xl grid grid-cols-1">
        {/* Top Segment: Profile Picture and Name/Title/Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b h-[280px]" style={{ borderColor: colors['--light-brown-border'] }}>
          {/* Profile Picture Section (Left Column) */}
          <div className="p-6 md:p-2 flex flex-col justify-center items-center h-full" style={{ background: 'linear-gradient(146.96deg, #A5917F 7.87%, #836B65 57.71%, #5F434A 110.99%, #DBD1D1 137.9%)' }}>
           
              <img
                src={resumeData.profileImage}
                alt="Profile"
                className="profile-image"
                onError={(e) => {
                  e.target.onerror = null; // prevents infinite loop
                  e.target.src = "https://placehold.co/96x96/6b7280/FFFFFF?text=Profile"; // Placeholder on error
                }}
              />
           
          </div>

          {/* Name, Job Title, and Summary Section (Right Column) */}
          <div className="p-6 md:pt-8 md:pb-2 md:px-8 md:col-span-2 flex flex-col h-full" style={{ backgroundColor: colors['--light-grey-background'], color: colors['--coffee'] }}>
            <h1 className="font-dm-mono-header text-lg" style={{ color: colors['--charcoal'] }}>CURRICULUM VITAE</h1>
            <h2 className="text-4xl font-bold mb-1" style={{ color: colors['--charcoal'] }}>{resumeData.name}</h2>
            <p className="text-md mb-4 font-dm-mono-subheading" style={{ color: colors['--teal-main'] }}>{resumeData.title}</p>
            <section className="w-full">
              <p className="content-body text-justify">{resumeData.summary}</p>
            </section>
          </div>
        </div>

        {/* Lower Two-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {/* Left Column - Contact, Education, Skills, Certifications */}
          <div className="flex flex-col md:col-span-1 p-6 md:p-8" style={{ backgroundColor: colors['--off-white'] }}>
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 pb-2 flex items-center border-b" style={{ borderColor: colors['--light-brown-border'], color: colors['--charcoal'] }}>
                <ContactIcon className="mr-3" style={{ color: colors['--teal-main'] }} size={SectionIconSize} /> Contact
              </h2>
              <div className="flex items-center gap-2 mb-2">
                <MailIcon className="mr-2" style={{ color: colors['--teal-main'] }} size={ContactIconSize} />
                <p className="text-sm" style={{ color: colors['--coffee'] }}>{resumeData.contact.email}</p>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <PhoneIcon className="mr-2" style={{ color: colors['--teal-main'] }} size={ContactIconSize} />
                <p className="text-sm" style={{ color: colors['--coffee'] }}>{resumeData.contact.phone}</p>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <MapPinIcon className="mr-2" style={{ color: colors['--teal-main'] }} size={ContactIconSize} />
                <p className="text-sm" style={{ color: colors['--coffee'] }}>{resumeData.contact.location}</p>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <GlobeIcon className="mr-2" style={{ color: colors['--teal-main'] }} size={ContactIconSize} />
                <a href={`http://${resumeData.contact.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-sm" style={{ color: colors['--coffee'] }}>{resumeData.contact.website}</a>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <GitHubIcon className="mr-2" style={{ color: colors['--teal-main'] }} size={ContactIconSize} />
                <a href={`https://${resumeData.contact.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-sm" style={{ color: colors['--coffee'] }}>{resumeData.contact.github}</a>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <LinkedInIcon className="mr-2" style={{ color: colors['--teal-main'] }} size={ContactIconSize} />
                <a href={`https://${resumeData.contact.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-sm" style={{ color: colors['--coffee'] }}>{resumeData.contact.linkedin}</a>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 pb-2 flex items-center border-b" style={{ borderColor: colors['--light-brown-border'], color: colors['--charcoal'] }}>
                <EducationIcon className="mr-3" style={{ color: colors['--teal-main'] }} size={SectionIconSize} /> Education
              </h2>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="mb-4">
                  <p className="font-semibold text-sm" style={{ color: colors['--charcoal'] }}>{edu.institution}</p>
                  <p className="uppercase font-dm-mono-degree" style={{ color: colors['--bronze-dark'] }}>{edu.degree}</p>
                  {edu.duration && <p className="italic font-dm-mono-edu-detail" style={{ color: colors['--charcoal'] }}>{edu.duration}</p>}
                  {edu.note && <p className="italic font-dm-mono-edu-detail" style={{ color: colors['--charcoal'] }}>{edu.note}</p>}
                </div>
              ))}
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 pb-2 flex items-center border-b" style={{ borderColor: colors['--light-brown-border'], color: colors['--charcoal'] }}>
                <CertificationsIcon className="mr-3" style={{ color: colors['--teal-main'] }} size={SectionIconSize} /> Certifications
              </h2>
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className="mb-3">
                  <p className="font-semibold text-sm" style={{ color: colors['--charcoal'] }}>{cert.name}</p>
                  <p className="font-dm-mono-edu-detail" style={{ color: colors['--bronze-dark'] }}>{cert.issuer}</p>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-lg font-bold mb-3 pb-2 flex items-center border-b" style={{ borderColor: colors['--light-brown-border'], color: colors['--charcoal'] }}>
                <SkillsIcon className="mr-3" style={{ color: colors['--teal-main'] }} size={SectionIconSize} /> Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span key={index} className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: 'transparent', color: colors['--teal-main'], border: `1px solid ${colors['--light-brown-border']}` }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Experience */}
          <div className="p-6 md:p-8 md:col-span-2" style={{ color: colors['--coffee'] }}>
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center border-b" style={{ borderColor: colors['--light-grey-border'], color: colors['--charcoal'], paddingBottom: '0.5rem' }}>
                Experience
              </h2>
              {resumeData.experience.map((job, index) => (
                <div key={index} className="mb-6">
                  <h3 className="font-dm-sans-experience-title" style={{ color: colors['--coffee'] }}>{job.title}</h3>
                  <p className="uppercase font-dm-mono-subheading text-xs" style={{ color: colors['--bronze-dark'] }}>{job.company}</p>
                  <p className="text-sm font-dm-mono-edu-detail" style={{ color: colors['--teal-main'] }}>{job.duration}</p>
                  
                  <ul className="list-none mt-2 space-y-1">
                    {job.details.map((detail, idx) => (
                      <li key={idx} className="text-sm pl-4 relative bullet-point content-body">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
