import Markdown from "@/src/components/docs/Markdown"

export const dynamic = "force-dynamic"

const md = `
# AI Resume Tailor: Optimize Your Resume for Any Job

This guide walks you through using our AI-powered JobFit Tailor to create a perfectly optimized resume for any job. Simply upload your resume and a job description, and let our AI do the rest!

## Getting Started

1.  **Upload Your Resume:**
    *   Click the "Upload Resume" button.
    *   Select your resume file (PDF or text) from your computer.

2.  **Activate AI Tailoring Inputs:**
    *   Locate the "AI Resume Tailor" section on the page.
    *   Toggle the switch next to "Enable Job Tailoring" to the **ON** position. This will reveal new input fields.

## Tailor Your Resume

Once the tailoring inputs are enabled, you'll see options to refine your resume:

1.  **Provide a Job Description (Required for Tailoring):**
    *   **Paste Text:** Copy and paste the job description directly into the large text area.
    *   **Upload File:** Click the "Upload Job Description" button to select a job description file (PDF or text).
    *   *Tip:* The more detailed the job description, the better our AI can tailor your resume!

2.  **Select Your Resume Tone:**
    *   Choose a tone that best suits the job and company culture:
        *   **Formal:** Professional, conservative language. Emphasizes stability and proven track record.
        *   **Neutral:** Balanced, professional tone. Focuses on clear, concise descriptions.
        *   **Creative:** Dynamic, engaging language. Highlights innovation and unique contributions.

3.  **Add Extra Prompt (Optional):**
    *   Use this field for any specific instructions or nuances you want the AI to consider. For example:
        *   "Emphasize my leadership skills."
        *   "Focus on my experience with project management."
        *   "Downplay my early career roles."

## Generate Your Tailored Resume

After providing all the necessary information, click the "Generate Tailored Resume" button. Our AI will process your inputs and generate an optimized resume tailored to the job description you provided.

## Tips for Best Results

*   **Be Specific:** Provide as much detail as possible in the job description.
*   **Review and Refine:** Always review the AI-generated resume and make any final adjustments.
*   **Experiment with Tones:** Try different tones to see which one best fits the job application.
*   **Check Character Limits:** Ensure your pasted job description and extra prompt are within the specified character limits.
`

export default function Guide() {
	return <Markdown>{md}</Markdown>
}
