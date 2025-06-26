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

interface ResumeEditorProps {
  resumeData: any
  onSave: (data: any) => void
  onCancel: () => void
}

const ResumeEditor = ({ resumeData, onSave, onCancel }: ResumeEditorProps) => {
  const [editedData, setEditedData] = useState({ ...resumeData })
  const [showPreview, setShowPreview] = useState(false)
  const [newSkill, setNewSkill] = useState("")

  const handleInputChange = (field: string, value: any) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleNestedInputChange = (section: string, field: string, value: any) => {
    setEditedData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleExperienceChange = (index: number, field: string, value: any) => {
    const updatedExperience = [...editedData.experience]
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value,
    }
    setEditedData((prev) => ({
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
    setEditedData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }))
  }

  const removeExperience = (index: number) => {
    const updatedExperience = editedData.experience.filter((_: any, i: number) => i !== index)
    setEditedData((prev) => ({
      ...prev,
      experience: updatedExperience,
    }))
  }

  const handleSkillAdd = () => {
    if (newSkill.trim() && !editedData.skills.includes(newSkill.trim())) {
      setEditedData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill("")
    }
  }

  const handleSkillRemove = (skillToRemove: string) => {
    setEditedData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill: string) => skill !== skillToRemove),
    }))
  }

  const handleProfileImageChange = (imageUrl: string) => {
    setEditedData((prev) => ({
      ...prev,
      profileImage: imageUrl,
    }))
  }

  const handleSave = () => {
    onSave(editedData)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Resume</h1>
            <p className="text-gray-600">Make changes to your resume information</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)} className="flex items-center gap-2">
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className={`grid gap-6 ${showPreview ? "grid-cols-2" : "grid-cols-1"}`}>
          {/* Editor Panel */}
          <div className="space-y-6">
            {/* Profile Image */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileImageUploader currentImage={editedData.profileImage} onImageChange={handleProfileImageChange} />
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={editedData.name || ""}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={editedData.title || ""}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    rows={4}
                    value={editedData.summary || ""}
                    onChange={(e) => handleInputChange("summary", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedData.contact?.email || ""}
                      onChange={(e) => handleNestedInputChange("contact", "email", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editedData.contact?.phone || ""}
                      onChange={(e) => handleNestedInputChange("contact", "phone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={editedData.contact?.location || ""}
                      onChange={(e) => handleNestedInputChange("contact", "location", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      value={editedData.contact?.linkedin || ""}
                      onChange={(e) => handleNestedInputChange("contact", "linkedin", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="github">GitHub URL</Label>
                  <Input
                    id="github"
                    value={editedData.contact?.github || ""}
                    onChange={(e) => handleNestedInputChange("contact", "github", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSkillAdd()}
                  />
                  <Button onClick={handleSkillAdd} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {editedData.skills?.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button onClick={() => handleSkillRemove(skill)} className="ml-1 hover:text-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Work Experience</CardTitle>
                  <Button onClick={addExperience} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {editedData.experience?.map((exp: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Experience {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={exp.company || ""}
                          onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Position</Label>
                        <Input
                          value={exp.position || ""}
                          onChange={(e) => handleExperienceChange(index, "position", e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Duration</Label>
                      <Input
                        value={exp.duration || ""}
                        onChange={(e) => handleExperienceChange(index, "duration", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        rows={3}
                        value={Array.isArray(exp.description) ? exp.description.join("\n") : exp.description || ""}
                        onChange={(e) => handleExperienceChange(index, "description", e.target.value.split("\n"))}
                        placeholder="Enter job responsibilities, one per line"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="sticky top-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-white" style={{ fontSize: "12px" }}>
                    {/* Profile Header Preview */}
                    <div className="text-center mb-4 pb-4 border-b">
                      <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden bg-gray-200">
                        <img
                          src={
                            editedData.profileImage ||
                            "/placeholder.svg?height=64&width=64&query=generic+profile+avatar"
                          }
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h2 className="font-bold text-lg">{editedData.name || "Your Name"}</h2>
                      <p className="text-gray-600">{editedData.title || "Your Job Title"}</p>
                      <p className="text-sm text-gray-500 mt-2">{editedData.summary || "Your professional summary"}</p>
                    </div>

                    {/* Contact Preview */}
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Contact</h3>
                      <div className="text-xs space-y-1">
                        <p>{editedData.contact?.email || "email@example.com"}</p>
                        <p>{editedData.contact?.phone || "+1 (555) 123-4567"}</p>
                        <p>{editedData.contact?.location || "City, State"}</p>
                      </div>
                    </div>

                    {/* Skills Preview */}
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-1">
                        {editedData.skills?.slice(0, 6).map((skill: string, index: number) => (
                          <span key={index} className="bg-gray-100 px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {editedData.skills?.length > 6 && (
                          <span className="text-xs text-gray-500">+{editedData.skills.length - 6} more</span>
                        )}
                      </div>
                    </div>

                    {/* Experience Preview */}
                    <div>
                      <h3 className="font-semibold mb-2">Experience</h3>
                      {editedData.experience?.slice(0, 2).map((exp: any, index: number) => (
                        <div key={index} className="mb-3">
                          <h4 className="font-medium text-sm">{exp.position || "Position"}</h4>
                          <p className="text-xs text-gray-600">{exp.company || "Company"}</p>
                          <p className="text-xs text-gray-500">{exp.duration || "Duration"}</p>
                        </div>
                      ))}
                      {editedData.experience?.length > 2 && (
                        <p className="text-xs text-gray-500">+{editedData.experience.length - 2} more positions</p>
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
