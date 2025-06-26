"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Save, X, Eye, EyeOff, Plus, Trash2 } from "lucide-react"
import ProfileImageUploader from "./ProfileImageUploader"
import styles from "./ResumeEditor.module.css"

interface ResumeData {
  name?: string
  title?: string
  summary?: string
  profileImage?: string
  contact?: {
    email?: string
    phone?: string
    location?: string
    linkedin?: string
    github?: string
  }
  skills?: string[]
  experience?: Array<{
    company?: string
    title?: string
    position?: string
    duration?: string
    description?: string[]
    details?: string[]
  }>
}

interface ResumeEditorProps {
  resumeData: ResumeData
  onSave: (data: ResumeData) => void
  onCancel: () => void
}

const ResumeEditor = ({ resumeData, onSave, onCancel }: ResumeEditorProps) => {
  // Normalize experience data to ensure consistent field names
  const normalizeExperienceData = (experience: any[]) => {
    return experience.map((exp) => ({
      company: exp.company || "",
      position: exp.title || exp.position || "", // Map 'title' to 'position'
      duration: exp.duration || "",
      description: Array.isArray(exp.details)
        ? exp.details
        : Array.isArray(exp.description)
          ? exp.description
          : exp.details
            ? [exp.details]
            : exp.description
              ? [exp.description]
              : [],
    }))
  }

  const [editedData, setEditedData] = useState<ResumeData>({
    ...resumeData,
    experience: normalizeExperienceData(resumeData.experience || []),
  })
  const [showPreview, setShowPreview] = useState(false)
  const [newSkill, setNewSkill] = useState("")

  const handleInputChange = (field: string, value: any) => {
    setEditedData((prev: ResumeData) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNestedInputChange = (section: string, field: string, value: any) => {
    setEditedData((prev: ResumeData) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof ResumeData] as any),
        [field]: value,
      },
    }))
  }

  const handleExperienceChange = (index: number, field: string, value: any) => {
    const updatedExperience = [...(editedData.experience || [])]
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    }
    setEditedData((prev: ResumeData) => ({
      ...prev,
      experience: updatedExperience,
    }))
  }

  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      duration: "",
      description: [],
    }
    setEditedData((prev: ResumeData) => ({
      ...prev,
      experience: [...(prev.experience || []), newExperience],
    }))
  }

  const removeExperience = (index: number) => {
    const updatedExperience = (editedData.experience || []).filter((_: any, i: number) => i !== index)
    setEditedData((prev: ResumeData) => ({
      ...prev,
      experience: updatedExperience,
    }))
  }

  const handleSkillAdd = () => {
    if (newSkill.trim() && !(editedData.skills || []).includes(newSkill.trim())) {
      setEditedData((prev: ResumeData) => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const handleSkillRemove = (skillToRemove: string) => {
    setEditedData((prev: ResumeData) => ({
      ...prev,
      skills: (prev.skills || []).filter((skill: string) => skill !== skillToRemove),
    }))
  }

  const handleProfileImageChange = (imageUrl: string) => {
    setEditedData((prev: ResumeData) => ({
      ...prev,
      profileImage: imageUrl,
    }))
  }

  const handleSave = () => {
    // Convert back to the original format for consistency
    const dataToSave = {
      ...editedData,
      experience: (editedData.experience || []).map((exp: any) => ({
        company: exp.company,
        title: exp.position, // Convert back to 'title'
        duration: exp.duration,
        details: Array.isArray(exp.description) ? exp.description : [exp.description].filter(Boolean),
      })),
    }
    onSave(dataToSave)
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.headerTitle}>Edit Resume</h1>
              <p className={styles.headerSubtitle}>Make changes to your resume information</p>
            </div>
            <div className={styles.headerActions}>
              <Button
                variant="default"
                onClick={() => setShowPreview(!showPreview)}
                className={styles.previewButton}
              >
                {showPreview ? <EyeOff className={styles.iconMd} /> : <Eye className={styles.iconMd} />}
                {showPreview ? "Hide Preview" : "Show Preview"}
              </Button>
              <Button variant="default" onClick={onCancel}>
                <X className={`${styles.iconMd} ${styles.gap2}`} />
                Cancel
              </Button>
              <Button onClick={handleSave} className={styles.saveButton}>
                <Save className={`${styles.iconMd} ${styles.gap2}`} />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <div className={`${styles.grid} ${showPreview ? styles.gridTwoColumns : styles.gridOneColumn}`}>
          {/* Editor Panel */}
          <div className={styles.editorPanel}>
            {/* Profile Image */}
            <Card className={styles.card}>
              <CardHeader>
                <CardTitle className={styles.cardTitle}>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileImageUploader currentImage={editedData.profileImage} onImageChange={handleProfileImageChange} />
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card className={styles.card}>
              <CardHeader>
                <CardTitle className={styles.cardTitle}>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className={styles.spaceY4}>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <Label htmlFor="name" className={styles.label}>
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={editedData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formField}>
                    <Label htmlFor="title" className={styles.label}>
                      Job Title
                    </Label>
                    <Input
                      id="title"
                      value={editedData.title || ""}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>
                <div className={styles.formField}>
                  <Label htmlFor="summary" className={styles.label}>
                    Professional Summary
                  </Label>
                  <Textarea
                    id="summary"
                    rows={4}
                    value={editedData.summary || ""}
                    onChange={(e) => handleInputChange("summary", e.target.value)}
                    className={styles.textarea}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className={styles.card}>
              <CardHeader>
                <CardTitle className={styles.cardTitle}>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className={styles.spaceY4}>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <Label htmlFor="email" className={styles.label}>
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedData.contact?.email || ""}
                      onChange={(e) => handleNestedInputChange("contact", "email", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formField}>
                    <Label htmlFor="phone" className={styles.label}>
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={editedData.contact?.phone || ""}
                      onChange={(e) => handleNestedInputChange("contact", "phone", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.formField}>
                    <Label htmlFor="location" className={styles.label}>
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={editedData.contact?.location || ""}
                      onChange={(e) => handleNestedInputChange("contact", "location", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formField}>
                    <Label htmlFor="linkedin" className={styles.label}>
                      LinkedIn URL
                    </Label>
                    <Input
                      id="linkedin"
                      value={editedData.contact?.linkedin || ""}
                      onChange={(e) => handleNestedInputChange("contact", "linkedin", e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>
                <div className={styles.formField}>
                  <Label htmlFor="github" className={styles.label}>
                    GitHub URL
                  </Label>
                  <Input
                    id="github"
                    value={editedData.contact?.github || ""}
                    onChange={(e) => handleNestedInputChange("contact", "github", e.target.value)}
                    className={styles.input}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className={styles.card}>
              <CardHeader>
                <CardTitle className={styles.cardTitle}>Skills</CardTitle>
              </CardHeader>
              <CardContent className={styles.spaceY4}>
                <div className={styles.skillsInputGroup}>
                  <Input
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSkillAdd()}
                    className={styles.input}
                  />
                  <Button onClick={handleSkillAdd} size="sm" className={styles.addSkillButton}>
                    <Plus className={styles.iconMd} />
                  </Button>
                </div>
                <div className={styles.skillsList}>
                  {(editedData.skills || []).map((skill: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className={styles.skillBadge}
                    >
                      {skill}
                      <button onClick={() => handleSkillRemove(skill)} className={styles.removeSkillButton}>
                        <X className={styles.iconSm} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className={styles.card}>
              <CardHeader>
                <div className={styles.experienceHeader}>
                  <CardTitle className={styles.cardTitle}>Work Experience</CardTitle>
                  <Button onClick={addExperience} size="sm" className={styles.addExperienceButton}>
                    <Plus className={`${styles.iconMd} ${styles.gap2}`} />
                    Add Experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent className={styles.spaceY6}>
                {(editedData.experience || []).map((exp: any, index: number) => (
                  <div key={index} className={styles.experienceItem}>
                    <div className={styles.experienceItemHeader}>
                      <h4 className={styles.experienceItemTitle}>Experience {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className={styles.removeExperienceButton}
                      >
                        <Trash2 className={styles.iconMd} />
                      </Button>
                    </div>
                    <div className={styles.formGrid}>
                      <div className={styles.formField}>
                        <Label className={styles.label}>Company</Label>
                        <Input
                          value={exp.company || ""}
                          onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formField}>
                        <Label className={styles.label}>Position</Label>
                        <Input
                          value={exp.position || ""}
                          onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                          className={styles.input}
                        />
                      </div>
                    </div>
                    <div className={styles.formField}>
                      <Label className={styles.label}>Duration</Label>
                      <Input
                        value={exp.duration || ""}
                        onChange={(e) => handleExperienceChange(index, "duration", e.target.value)}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formField}>
                      <Label className={styles.label}>Description</Label>
                      <Textarea
                        rows={3}
                        value={Array.isArray(exp.description) ? exp.description.join("\n") : exp.description || ""}
                        onChange={(e) => handleExperienceChange(index, "description", e.target.value.split("\n"))}
                        placeholder="Enter job responsibilities, one per line"
                        className={styles.textarea}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className={styles.previewContainer}>
              <Card className={styles.card}>
                <CardHeader>
                  <CardTitle className={styles.cardTitle}>Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={styles.previewContent}>
                    {/* Profile Header Preview */}
                    <div className={styles.previewHeader}>
                      <div className={styles.previewImageContainer}>
                        <img
                          src={
                            editedData.profileImage ||
                            "/placeholder.svg?height=64&width=64&query=generic+profile+avatar" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt="Profile"
                          className={styles.previewImage}
                        />
                      </div>
                      <h2 className={styles.previewName}>{editedData.name || "Your Name"}</h2>
                      <p className={styles.previewTitle}>{editedData.title || "Your Job Title"}</p>
                      <p className={styles.previewSummary}>{editedData.summary || "Your professional summary"}</p>
                    </div>

                    {/* Contact Preview */}
                    <div className={styles.previewSection}>
                      <h3 className={styles.previewSectionTitle}>Contact</h3>
                      <div className={styles.previewContactInfo}>
                        <p>{editedData.contact?.email || "email@example.com"}</p>
                        <p>{editedData.contact?.phone || "+1 (555) 123-4567"}</p>
                        <p>{editedData.contact?.location || "City, State"}</p>
                      </div>
                    </div>

                    {/* Skills Preview */}
                    <div className={styles.previewSection}>
                      <h3 className={styles.previewSectionTitle}>Skills</h3>
                      <div className={styles.previewSkillsList}>
                        {(editedData.skills || []).slice(0, 6).map((skill: string, index: number) => (
                          <span key={index} className={styles.previewSkill}>
                            {skill}
                          </span>
                        ))}
                        {(editedData.skills || []).length > 6 && (
                          <span className={styles.previewMoreSkills}>+{(editedData.skills || []).length - 6} more</span>
                        )}
                      </div>
                    </div>

                    {/* Experience Preview */}
                    <div>
                      <h3 className={styles.previewSectionTitle}>Experience</h3>
                      {(editedData.experience || []).slice(0, 2).map((exp: any, index: number) => (
                        <div key={index} className={styles.previewExperienceItem}>
                          <h4 className={styles.previewExperienceTitle}>{exp.position || "Position"}</h4>
                          <p className={styles.previewExperienceCompany}>{exp.company || "Company"}</p>
                          <p className={styles.previewExperienceDuration}>{exp.duration || "Duration"}</p>
                        </div>
                      ))}
                      {(editedData.experience || []).length > 2 && (
                        <p className={styles.previewMoreExperience}>+{(editedData.experience || []).length - 2} more positions</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResumeEditor
