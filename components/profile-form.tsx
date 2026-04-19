'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, X } from 'lucide-react'
import { showToast } from '@/lib/toast-utils'
import { saveProfile } from '@/lib/client-api'
import {
  createEmptyProfileFormData,
  normalizeProfileFormData,
  profileDepartments,
  profileDomains,
  profileSkillOptions,
  type ProfileFormData,
} from '@/lib/profile'

interface ProfileFormProps {
  initialProfile?: any
  title: string
  description: string
  submitLabel: string
  successTitle: string
  successDescription: string
  onSaved?: (updatedUser: any) => void
  onCancel?: () => void
}

export function ProfileForm({
  initialProfile,
  title,
  description,
  submitLabel,
  successTitle,
  successDescription,
  onSaved,
  onCancel,
}: ProfileFormProps) {
  const [saving, setSaving] = useState(false)
  const [step, setStep] = useState(1)
  const [customSkill, setCustomSkill] = useState('')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProfileFormData>(createEmptyProfileFormData())

  useEffect(() => {
    setFormData(normalizeProfileFormData(initialProfile))
  }, [initialProfile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'graduationYear' ? Number(value) || prev.graduationYear : value,
    }))
  }

  const handleLinkChange = (field: 'portfolio' | 'github' | 'linkedin', value: string) => {
    setFormData((prev) => ({
      ...prev,
      links: { ...prev.links, [field]: value },
    }))
  }

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((existingSkill) => existingSkill !== skill)
        : [...prev.skills, skill],
    }))
  }

  const addCustomSkill = () => {
    const trimmedSkill = customSkill.trim()
    if (!trimmedSkill || formData.skills.includes(trimmedSkill)) {
      return
    }

    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, trimmedSkill],
    }))
    setCustomSkill('')
    showToast.funny(`${trimmedSkill} added to your arsenal!`)
  }

  const handleSaveProfile = async () => {
    if (!formData.cgpa || !formData.department || !formData.domain) {
      showToast.warning('Please fill all required fields')
      setSaveError('CGPA, department, and preferred domain are required.')
      return
    }

    setSaving(true)
    setSaveError(null)

    try {
      const response = await saveProfile(formData)
      const updatedUser = {
        ...response.user,
        profileCompleted: true,
        profile: response.profile,
      }

      showToast.success(successTitle, successDescription)
      onSaved?.(updatedUser)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error saving profile'
      setSaveError(message)
      showToast.error(message)
    } finally {
      setSaving(false)
    }
  }

  const handleResumeSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    setFormData((prev) => ({
      ...prev,
      resume: file.name,
    }))
    showToast.success('Resume selected', file.name)
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-sm text-foreground/60 mt-1">{description}</p>
          </div>
          <span className="text-sm text-foreground/60">Step {step}/3</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {step === 1 && (
        <Card className="border-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
            <CardDescription>Tell us about your academic background</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cgpa">CGPA *</Label>
                <Input
                  id="cgpa"
                  name="cgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="8.5"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div>
                <Label htmlFor="department">Department *</Label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-foreground profile-select"
                >
                  <option value="">Select Department</option>
                  {profileDepartments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="graduationYear">Graduation Year</Label>
                <Input
                  id="graduationYear"
                  name="graduationYear"
                  type="number"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              {onCancel && (
                <Button onClick={onCancel} type="button" variant="outline" className="border-white/20">
                  Cancel
                </Button>
              )}
              <Button
                onClick={() => setStep(2)}
                type="button"
                className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
              >
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="border-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle>Skills & Domain</CardTitle>
            <CardDescription>What are you skilled in?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="domain">Preferred Domain *</Label>
              <select
                id="domain"
                name="domain"
                value={formData.domain}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-md text-foreground profile-select"
              >
                <option value="">Select Domain</option>
                {profileDomains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="mb-3 block">Technical Skills</Label>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {formData.skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center justify-between bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 px-3 py-2 rounded-lg border border-emerald-400/30"
                  >
                    <span className="text-sm">{skill}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          skills: prev.skills.filter((existingSkill) => existingSkill !== skill),
                        }))
                      }
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {profileSkillOptions
                  .filter((skill) => !formData.skills.includes(skill))
                  .map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className="px-3 py-2 rounded-lg border border-white/20 hover:bg-white/5 hover:border-emerald-400/50 text-sm transition-colors text-left"
                    >
                      {skill}
                    </button>
                  ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
                  placeholder="Add custom skill..."
                  className="bg-white/5 border-white/10"
                />
                <Button onClick={addCustomSkill} type="button" size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={() => setStep(1)} type="button" variant="outline" className="flex-1 border-white/20">
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                type="button"
                className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
              >
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="border-white/10 backdrop-blur">
          <CardHeader>
            <CardTitle>Bio & Links</CardTitle>
            <CardDescription>Add your portfolio and social links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="bio">About You</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell companies about yourself, your experience, and what you're looking for..."
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-3">
              <Label>Links (Optional)</Label>
              <Input
                placeholder="Portfolio URL"
                value={formData.links.portfolio}
                onChange={(e) => handleLinkChange('portfolio', e.target.value)}
                className="bg-white/5 border-white/10"
              />
              <Input
                placeholder="GitHub URL"
                value={formData.links.github}
                onChange={(e) => handleLinkChange('github', e.target.value)}
                className="bg-white/5 border-white/10"
              />
              <Input
                placeholder="LinkedIn URL"
                value={formData.links.linkedin}
                onChange={(e) => handleLinkChange('linkedin', e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>

            <div>
              <Label htmlFor="resume">Resume File</Label>
              <div className="space-y-3">
                <Input
                  id="resumeUpload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeSelection}
                  className="bg-white/5 border-white/10 file:mr-4 file:rounded-md file:border-0 file:bg-emerald-500/20 file:px-3 file:py-2 file:text-sm file:font-medium file:text-emerald-300"
                />
                <Input
                  id="resume"
                  name="resume"
                  type="text"
                  placeholder="resume.pdf"
                  value={formData.resume}
                  onChange={handleInputChange}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <p className="text-xs text-foreground/50 mt-1">Choose a resume file or type the filename manually.</p>
            </div>

            {saveError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {saveError}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button onClick={() => setStep(2)} type="button" variant="outline" className="flex-1 border-white/20">
                Back
              </Button>
              <Button
                onClick={handleSaveProfile}
                type="button"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
              >
                {saving ? 'Saving...' : submitLabel}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
