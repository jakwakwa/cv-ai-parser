export { default as ResumeTemplate1 } from "./resume-template-1";
export { default as ResumeTemplate2 } from "./resume-template-2";
export { default as ResumeTemplate3 } from "./resume-template-3";
export { default as TemplateSelector } from "./template-selector";

// Template metadata for UI selection
export const templateMetadata = [
  {
    id: "template-1",
    name: "Modern Two-Column",
    description:
      "Clean layout with left sidebar featuring profile and contact information",
    component: "ResumeTemplate1",
  },
  {
    id: "template-2",
    name: "Timeline Vertical",
    description: "Chronological emphasis with timeline design for experience",
    component: "ResumeTemplate2",
  },
  {
    id: "template-3",
    name: "Classic Centered",
    description:
      "Elegant symmetric design with centered header and balanced sections",
    component: "ResumeTemplate3",
  },
];
