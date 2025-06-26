"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import ProfileImageUploader from "./ProfileImageUploader"
import { Save, Eye, EyeOff } from "lucide-react"

interface ResumeEditorProps {
  resumeData: any
  onSave: (updatedData: any) => void
  onCancel: () => void
}

const ResumeEditor = ({ resumeData, onSave, onCancel }: ResumeEditorProps) => {
  const [editedData, setEditedData] = useState(resumeData)
  const [showPreview, setShowPreview] = useState(false)

  const handleInputChange = (field: string, value: any) => {
    setEditedData((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleContactChange = (field: string, value: string) => {
    setEditedData((prev: any) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }))
  }

  const handleImageChange = (imageUrl: string) => {
    setEditedData((prev: any) => ({
      ...prev,
      profileImage: imageUrl,
    }))
  }

  const handleSave = () => {
    onSave(editedData)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Edit Resume</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? "Hide Preview" : "Show Preview"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-6">
          {/* Profile Image */}
          <ProfileImageUploader currentImage={editedData.profileImage} onImageChange={handleImageChange} />

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={editedData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  value={editedData.title || ""}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
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
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedData.contact?.email || ""}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editedData.contact?.phone || ""}
                  onChange={(e) => handleContactChange("phone", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editedData.contact?.location || ""}
                  onChange={(e) => handleContactChange("location", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={editedData.contact?.website || ""}
                  onChange={(e) => handleContactChange("website", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={editedData.contact?.github || ""}
                  onChange={(e) => handleContactChange("github", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={editedData.contact?.linkedin || ""}
                  onChange={(e) => handleContactChange("linkedin", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Textarea
                  id="skills"
                  rows={3}
                  value={editedData.skills?.join(", ") || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "skills",
                      e.target.value
                        .split(",")
                        .map((s: string) => s.trim())
                        .filter((s: string) => s),
                    )
                  }
                  placeholder="JavaScript, React, Node.js, Python..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  {/* Profile Image Preview */}
                  {editedData.profileImage && (
                    <div className="flex justify-center">
                      <img
                        src={editedData.profileImage || "/placeholder.svg"}
                        alt="Profile Preview"
                        className="w-20 h-20 object-cover rounded-full border-2 border-gray-200"
                      />
                    </div>
                  )}

                  {/* Basic Info Preview */}
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{editedData.name || "Your Name"}</h3>
                    <p className="text-blue-600 font-medium">{editedData.title || "Your Title"}</p>
                  </div>

                  <Separator />

                  {/* Summary Preview */}
                  {editedData.summary && (
                    <div>
                      <h4 className="font-semibold mb-2">Summary</h4>
                      <p className="text-gray-700 text-xs leading-relaxed">{editedData.summary}</p>
                    </div>
                  )}

                  <Separator />

                  {/* Contact Preview */}
                  <div>
                    <h4 className="font-semibold mb-2">Contact</h4>
                    <div className="space-y-1 text-xs">
                      {editedData.contact?.email && <p>📧 {editedData.contact.email}</p>}
                      {editedData.contact?.phone && <p>📱 {editedData.contact.phone}</p>}
                      {editedData.contact?.location && <p>📍 {editedData.contact.location}</p>}
                      {editedData.contact?.website && <p>🌐 {editedData.contact.website}</p>}
                      {editedData.contact?.github && <p>💻 {editedData.contact.github}</p>}
                      {editedData.contact?.linkedin && <p>💼 {editedData.contact.linkedin}</p>}
                    </div>
                  </div>

                  <Separator />

                  {/* Skills Preview */}
                  {editedData.skills && editedData.skills.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {editedData.skills.slice(0, 8).map((skill: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {editedData.skills.length > 8 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            +{editedData.skills.length - 8} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumeEditor
