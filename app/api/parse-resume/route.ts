import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

// Define the schema for resume data
const resumeSchema = z.object({
  name: z.string(),
  title: z.string(),
  summary: z.string(),
  contact: z
    .object({
      email: z.string().optional(),
      phone: z.string().optional(),
      location: z.string().optional(),
      website: z.string().optional(),
      github: z.string().optional(),
      linkedin: z.string().optional(),
    })
    .optional(),
  experience: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      duration: z.string().optional(),
      details: z.array(z.string()),
    }),
  ),
  education: z
    .array(
      z.object({
        degree: z.string(),
        institution: z.string(),
        duration: z.string().optional(),
        note: z.string().optional(),
      }),
    )
    .optional(),
  certifications: z
    .array(
      z.object({
        name: z.string(),
        issuer: z.string(),
        date: z.string().optional(),
        id: z.string().optional(),
      }),
    )
    .optional(),
  skills: z.array(z.string()),
})

// Improved fallback parsing function using regex and text processing
function parseResumeWithRegex(content: string) {
  console.log("Starting regex parsing...")
  console.log(`Content preview: ${content.substring(0, 200)}...`)

  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  console.log(`Processing ${lines.length} lines of content`)

  // --- Name and Title ---
  let name = "Unknown Name"
  let title = "Professional"

  // Look for name in first few lines (usually all caps or title case)
  for (let i = 0; i < Math.min(lines.length, 15); i++) {
    const line = lines[i]

    // Skip common headers and metadata
    if (
      line.toLowerCase().includes("resume") ||
      line.toLowerCase().includes("curriculum vitae") ||
      line.toLowerCase().includes("cv") ||
      line.includes("<?xml") ||
      line.includes("<dc:") ||
      line.includes("xmlns") ||
      line.includes("application/pdf") ||
      line.length < 3 ||
      line.length > 60
    ) {
      continue
    }

    // Look for name patterns - proper names with first and last name
    if (line.match(/^[A-Z][a-z]+ [A-Z][a-z]+/)) {
      if (!line.includes("@") && !line.includes("•") && !line.match(/\d{4}/) && !line.includes("http")) {
        name = line
        console.log(`Found name: ${name}`)
        break
      }
    }
    // Look for all caps names (common in resumes)
    else if (line.match(/^[A-Z\s]+$/) && line.length > 5 && line.length < 50) {
      if (!line.includes("@") && !line.includes("•") && !line.match(/\d/) && !line.includes("http")) {
        name = line
        console.log(`Found name (all caps): ${name}`)
        break
      }
    }
  }

  // Look for title/role after name or in nearby lines
  const nameIndex = lines.findIndex((line) => line === name)
  if (nameIndex >= 0) {
    // Check the next few lines for a title
    for (let i = nameIndex + 1; i < Math.min(nameIndex + 4, lines.length); i++) {
      const line = lines[i]
      if (
        line &&
        !line.includes("@") &&
        !line.includes("•") &&
        line.length < 100 &&
        line.length > 5 &&
        (line.includes("Engineer") ||
          line.includes("Developer") ||
          line.includes("Designer") ||
          line.includes("Manager") ||
          line.includes("Analyst") ||
          line.includes("Specialist"))
      ) {
        title = line
        console.log(`Found title: ${title}`)
        break
      }
    }
  }

  // --- Contact Information ---
  const contact: {
    email?: string
    phone?: string
    location?: string
    website?: string
    github?: string
    linkedin?: string
  } = {}

  // Look for contact info in the first portion of the resume
  const contactLines = lines.slice(0, 25).join(" ")

  const emailMatch = contactLines.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
  if (emailMatch) {
    contact.email = emailMatch[1]
    console.log(`Found email: ${contact.email}`)
  }

  // Improved phone regex to avoid false positives
  const phoneMatches = contactLines.match(/(\+?[\d\s\-()]{10,15})/gi)
  if (phoneMatches) {
    for (const match of phoneMatches) {
      const cleanPhone = match.replace(/[\s\-()]/g, "")
      // Only accept if it looks like a real phone number
      if (
        cleanPhone.length >= 10 &&
        cleanPhone.length <= 15 &&
        !cleanPhone.match(/^20\d{2}/) && // Not a year
        !cleanPhone.match(/^\d{8,}0{3,}/) // Not a long number with trailing zeros
      ) {
        contact.phone = cleanPhone
        console.log(`Found phone: ${contact.phone}`)
        break
      }
    }
  }

  // Enhanced location detection
  const locationPatterns = [
    // City, Country format
    /([A-Za-z\s]+,\s*[A-Za-z\s]+)/gi,
    // Cape Town, South Africa specifically
    /Cape Town,?\s*South Africa/gi,
    // Other common location formats
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*,\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi,
  ]

  for (const pattern of locationPatterns) {
    const locationMatches = contactLines.match(pattern)
    if (locationMatches) {
      for (const match of locationMatches) {
        if (!match.includes("@") && !match.includes("http") && match.length < 50 && match.includes(",")) {
          contact.location = match.trim()
          console.log(`Found location: ${contact.location}`)
          break
        }
      }
      if (contact.location) break
    }
  }

  // Look for website
  const websiteMatch = contactLines.match(/((?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i)
  if (websiteMatch && !websiteMatch[1].includes("@")) {
    contact.website = websiteMatch[1]
    console.log(`Found website: ${contact.website}`)
  }

  // Look for GitHub
  const githubMatch = contactLines.match(/github\.com\/([a-zA-Z0-9-]+)/i)
  if (githubMatch) {
    contact.github = `github.com/${githubMatch[1]}`
    console.log(`Found GitHub: ${contact.github}`)
  }

  // Look for LinkedIn
  const linkedinMatch = contactLines.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/i)
  if (linkedinMatch) {
    contact.linkedin = `linkedin.com/in/${linkedinMatch[1]}`
    console.log(`Found LinkedIn: ${contact.linkedin}`)
  }

  // --- Summary ---
  let summary = "Experienced professional with a strong background in their field."

  // Look for summary/objective/about sections
  const summaryPatterns = [
    /(?:SUMMARY|OBJECTIVE|ABOUT|PROFILE)\s*:?\s*([\s\S]*?)(?=EXPERIENCE|WORK|EMPLOYMENT|EDUCATION|SKILLS|$)/i,
    /(?:PROFESSIONAL SUMMARY|CAREER SUMMARY)\s*:?\s*([\s\S]*?)(?=EXPERIENCE|WORK|EMPLOYMENT|EDUCATION|SKILLS|$)/i,
  ]

  for (const pattern of summaryPatterns) {
    const match = content.match(pattern)
    if (match && match[1] && match[1].trim().length > 20) {
      const cleanSummary = match[1].trim().replace(/\s+/g, " ").replace(/\n+/g, " ")
      // Make sure it's not metadata
      if (!cleanSummary.includes("<?xml") && !cleanSummary.includes("<dc:")) {
        summary = cleanSummary
        console.log(`Found summary: ${summary.substring(0, 100)}...`)
        break
      }
    }
  }

  // --- Experience ---
  const experience = []

  // Look for experience section with various patterns
  const experiencePatterns = [
    /(?:EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT|PROFESSIONAL EXPERIENCE)\s*:?\s*([\s\S]*?)(?=EDUCATION|SKILLS|CERTIFICATIONS|$)/i,
    /(?:WORK HISTORY|CAREER HISTORY)\s*:?\s*([\s\S]*?)(?=EDUCATION|SKILLS|CERTIFICATIONS|$)/i,
  ]

  let experienceSection = ""
  for (const pattern of experiencePatterns) {
    const match = content.match(pattern)
    if (match && match[1]) {
      experienceSection = match[1]
      console.log("Found experience section")
      break
    }
  }

  if (experienceSection) {
    console.log("Processing experience section...")

    // Split by potential job entries - look for lines that start with job titles or companies
    const jobBlocks = experienceSection.split(
      /(?=\n(?:[A-Z][^a-z\n]*(?:Engineer|Developer|Manager|Analyst|Specialist|Director|Lead|Senior|Junior|Designer)|[A-Z][a-zA-Z\s&,.-]+(?:Inc|LLC|Corp|Company|Ltd|Technologies|Solutions|Systems)))/i,
    )

    for (const block of jobBlocks) {
      if (block.trim().length < 20) continue

      const blockLines = block
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0)
      if (blockLines.length < 2) continue

      let jobTitle = ""
      let company = ""
      let duration = ""
      const details = []

      // Try to identify job title, company, and duration
      for (let i = 0; i < Math.min(blockLines.length, 5); i++) {
        const line = blockLines[i]

        // Look for job title (usually contains role keywords)
        if (
          !jobTitle &&
          line.match(/(?:Engineer|Developer|Manager|Analyst|Specialist|Director|Lead|Senior|Junior|Designer)/i) &&
          !line.match(/(?:Inc|LLC|Corp|Company|Ltd)/i)
        ) {
          jobTitle = line
        }
        // Look for company (often has company indicators or is a proper noun)
        else if (
          !company &&
          (line.match(/(?:Inc|LLC|Corp|Company|Ltd|Technologies|Solutions|Systems)/i) ||
            (line.match(/^[A-Z][a-zA-Z\s&,.-]+$/) && !jobTitle))
        ) {
          company = line
        }
        // Look for duration (contains years/months)
        else if (
          !duration &&
          line.match(/(?:20\d{2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{1,2}\/\d{4})/i)
        ) {
          duration = line
        }
      }

      // Extract bullet points and descriptions
      for (const line of blockLines) {
        if (line.match(/^[•\-*]\s*/)) {
          const cleanDetail = line.replace(/^[•\-*]\s*/, "").trim()
          if (cleanDetail.length > 15) {
            details.push(cleanDetail)
          }
        } else if (
          line.length > 30 &&
          !line.match(/(?:20\d{2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i) &&
          !line.match(/(?:Engineer|Developer|Manager|Inc|LLC|Corp)/i)
        ) {
          // Potential description line
          details.push(line)
        }
      }

      if (jobTitle || company) {
        experience.push({
          title: jobTitle || "Position",
          company: company || "Company",
          duration: duration || "",
          details: details.length > 0 ? details : ["Responsibilities and achievements in this role."],
        })
        console.log(`Found job: ${jobTitle} at ${company}`)
      }
    }
  }

  // --- Education ---
  const education = []
  const educationMatch = content.match(
    /(?:EDUCATION|ACADEMIC BACKGROUND)\s*:?\s*([\s\S]*?)(?=EXPERIENCE|SKILLS|CERTIFICATIONS|$)/i,
  )

  if (educationMatch) {
    console.log("Processing education section...")
    const eduLines = educationMatch[1]
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0)

    for (let i = 0; i < eduLines.length; i++) {
      const line = eduLines[i]
      if (line.match(/(?:University|College|School|Institute|Academy)/i)) {
        const institution = line
        let degree = ""
        let duration = ""

        // Look for degree in nearby lines
        for (let j = Math.max(0, i - 2); j <= Math.min(eduLines.length - 1, i + 2); j++) {
          if (j !== i && eduLines[j].match(/(?:Bachelor|Master|PhD|Degree|Diploma|Certificate|B\.|M\.|Ph\.D)/i)) {
            degree = eduLines[j]
            break
          }
        }

        // Look for duration
        for (let j = Math.max(0, i - 2); j <= Math.min(eduLines.length - 1, i + 2); j++) {
          if (eduLines[j].match(/20\d{2}/)) {
            duration = eduLines[j]
            break
          }
        }

        education.push({
          institution,
          degree: degree || "Degree",
          duration: duration || "",
        })
        console.log(`Found education: ${degree} from ${institution}`)
      }
    }
  }

  // --- Skills ---
  let skills = []
  const skillsMatch = content.match(
    /(?:SKILLS|TECHNICAL SKILLS|CORE COMPETENCIES|TECHNOLOGIES)\s*:?\s*([\s\S]*?)(?=EXPERIENCE|EDUCATION|CERTIFICATIONS|$)/i,
  )

  if (skillsMatch) {
    console.log("Processing skills section...")
    const skillsText = skillsMatch[1]

    // Split by common separators
    skills = skillsText
      .split(/[,•\-\n|]/)
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 1 && skill.length < 50)
      .filter((skill) => !skill.match(/^\d+$/)) // Remove standalone numbers
      .filter((skill) => !skill.match(/^[^\w\s]+$/)) // Remove lines with only special characters
      .slice(0, 25) // Limit to 25 skills
  }

  // Calculate confidence based on what we found
  let confidence = 0
  if (name !== "Unknown Name") confidence += 20
  if (title !== "Professional") confidence += 15
  if (Object.keys(contact).length > 0) confidence += 15
  if (summary.length > 50 && !summary.includes("<?xml")) confidence += 10
  if (experience.length > 0) confidence += 20
  if (education.length > 0) confidence += 10
  if (skills.length > 0) confidence += 10

  console.log(`Regex parsing completed with ${confidence}% confidence`)
  console.log(`Found: ${experience.length} jobs, ${education.length} education entries, ${skills.length} skills`)

  return {
    data: {
      name,
      title,
      summary,
      contact,
      experience:
        experience.length > 0
          ? experience
          : [{ title: "Position", company: "Company", details: ["Experience details not found in resume."] }],
      education: education.length > 0 ? education : [{ degree: "Degree", institution: "Institution" }],
      certifications: [],
      skills: skills.length > 0 ? skills : ["Skills not found"],
    },
    confidence: Math.min(confidence, 85), // Cap regex confidence at 85%
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text: fileContent, filename } = body

    if (!fileContent) {
      return NextResponse.json({ error: "No text content provided" }, { status: 400 })
    }

    console.log(`Processing extracted text from: ${filename}`)
    console.log(`Content length: ${fileContent.length} characters`)
    console.log(`First 500 chars: ${fileContent.substring(0, 500)}`)

    // Check if Google Gemini API key is available
    const hasGeminiKey =
      process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY

    let parsedResume
    let parseMethod = "regex" // Default to regex
    let confidence = 0

    if (hasGeminiKey) {
      try {
        console.log("Using Google Gemini for AI parsing...")
        // Use Google Gemini to parse the resume content with enhanced prompt
        const { object } = await generateObject({
          model: google("gemini-1.5-pro-latest"),
          schema: resumeSchema,
          prompt: `
            Parse the following resume content and extract structured information. Pay special attention to contact details.
            
            IMPORTANT INSTRUCTIONS:
            - Extract ALL contact information carefully, including location, GitHub, and LinkedIn URLs
            - For location: Look for patterns like "City, Country" or "Cape Town, South Africa"
            - For GitHub: Look for github.com URLs or mentions of GitHub profiles
            - For LinkedIn: Look for linkedin.com URLs or mentions of LinkedIn profiles
            - For phone numbers: Include country codes and format consistently
            - For websites: Extract personal websites or portfolio URLs
            
            Focus on extracting:
            - Personal information (name, title, contact details including location, GitHub, LinkedIn)
            - Professional summary
            - Work experience with job titles, companies, dates, and detailed descriptions
            - Education background
            - Certifications with dates and credential IDs if available
            - Skills (separate by commas)
            
            For experience details, break down responsibilities and achievements into separate bullet points.
            
            Contact information format should be:
            - email: full email address
            - phone: phone number with country code if present
            - location: "City, Country" format
            - website: personal website URL
            - github: "github.com/username" format
            - linkedin: "linkedin.com/in/username" format
            
            Resume content:
            ${fileContent}
          `,
        })
        parsedResume = object
        parseMethod = "ai"
        confidence = 95 // High confidence for AI parsing
        console.log("Google Gemini parsing successful")

        // Log what was extracted for debugging
        console.log("Extracted contact info:", JSON.stringify(parsedResume.contact, null, 2))
      } catch (aiError) {
        console.warn("Google Gemini parsing failed, falling back to regex parsing:", aiError)
        const regexResult = parseResumeWithRegex(fileContent)
        parsedResume = regexResult.data
        confidence = regexResult.confidence // Confidence from regex
        parseMethod = "regex_fallback"
      }
    } else {
      // Use fallback regex parsing
      console.log("No Google Gemini API key found, using fallback parsing")
      const regexResult = parseResumeWithRegex(fileContent)
      parsedResume = regexResult.data
      confidence = regexResult.confidence // Confidence from regex
    }

    return NextResponse.json({
      data: parsedResume,
      method: parseMethod,
      confidence: confidence,
    })
  } catch (error) {
    console.error("Error parsing resume:", error)
    return NextResponse.json({ error: "Failed to parse resume" }, { status: 500 })
  }
}
