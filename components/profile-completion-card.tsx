'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, Save, X } from 'lucide-react'
import { showToast } from '@/lib/toast-utils'
import { normalizeProfileFormData } from '@/lib/profile'
import { saveProfile } from '@/lib/client-api'

interface ProfileCompletionCardProps {
  user: any
  onProfileCompleted: (profile: any) => void
}

const departments = ['CSE', 'ECE', 'ME', 'CE', 'IT', 'CIVIL', 'MECH', 'AERO', 'BIOTECH']
const domains = ['Frontend', 'Backend', 'Full Stack', 'Data Science', 'Mobile', 'DevOps', 'AI/ML', 'Cloud', 'Cybersecurity']
const skillOptions = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Java', 'C++', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'Git', 'Angular', 'Vue.js']

export function ProfileCompletionCard({ user, onProfileCompleted }: ProfileCompletionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [profile, setProfile] = useState(() => {
    const normalized = normalizeProfileFormData(user?.profile)

    return {
      cgpa: Number(normalized.cgpa) || 7.5,
      department: normalized.department || 'CSE',
      gradYear: normalized.graduationYear,
      specialization: user?.profile?.specialization || '',
      domain: normalized.domain || 'Full Stack Development',
      skills: normalized.skills,
      bio: normalized.bio,
      resumeFile: normalized.resume,
      portfolioLink: normalized.links.portfolio,
      githubLink: normalized.links.github,
      linkedinLink: normalized.links.linkedin,
    }
  })
  const [customSkill, setCustomSkill] = useState('')

  const handleSaveProfile = async () => {
    setIsSubmitting(true)
    try {
      const response = await saveProfile({
        cgpa: String(profile.cgpa),
        department: profile.department,
        graduationYear: profile.gradYear,
        domain: profile.domain,
        skills: profile.skills,
        bio: profile.bio,
        resume: profile.resumeFile,
        links: {
          portfolio: profile.portfolioLink,
          github: profile.githubLink,
          linkedin: profile.linkedinLink,
        },
      })

      showToast.success('Profile completed!', 'Your profile helps us find better matches')
      onProfileCompleted(response.profile)
      setIsExpanded(false)
    } catch {
      showToast.error('Error saving profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const addCustomSkill = () => {
    if (customSkill.trim() && !profile.skills.includes(customSkill)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, customSkill]
      }))
      setCustomSkill('')
    }
  }

  return (
    <Card className="mb-6 border-cyan-400/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Complete Your Profile</CardTitle>
            <CardDescription>
              Help us find the best internship matches for your skills and experience
            </CardDescription>
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* CGPA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">CGPA (0-10)</label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={profile.cgpa}
                onChange={(e) => setProfile(prev => ({ ...prev, cgpa: parseFloat(e.target.value) }))}
                className="bg-background/50"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Department</label>
              <select
                value={profile.department}
                onChange={(e) => setProfile(prev => ({ ...prev, department: e.target.value }))}
                className="w-full bg-background/50 border border-white/20 rounded-md px-3 py-2 text-sm profile-select"
              >
                {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Graduation Year</label>
              <Input
                type="number"
                value={profile.gradYear}
                onChange={(e) => setProfile(prev => ({ ...prev, gradYear: parseInt(e.target.value) }))}
                className="bg-background/50"
              />
            </div>

            <div>
              <label className="text-sm font-semibold mb-2 block">Specialization</label>
              <Input
                placeholder="e.g., AI/ML, Web Development"
                value={profile.specialization}
                onChange={(e) => setProfile(prev => ({ ...prev, specialization: e.target.value }))}
                className="bg-background/50"
              />
            </div>
          </div>

          {/* Domain */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Preferred Domain</label>
            <select
              value={profile.domain}
              onChange={(e) => setProfile(prev => ({ ...prev, domain: e.target.value }))}
              className="w-full bg-background/50 border border-white/20 rounded-md px-3 py-2 text-sm profile-select"
            >
              {domains.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Skills */}
          <div>
            <label className="text-sm font-semibold mb-3 block">Technical Skills</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
              {skillOptions.map(skill => (
                <button
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    profile.skills.includes(skill)
                      ? 'bg-cyan-500 text-background'
                      : 'bg-background/50 border border-white/20 hover:border-cyan-400'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            {/* Custom Skill Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom skill..."
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                className="bg-background/50"
              />
              <Button onClick={addCustomSkill} variant="outline" className="shrink-0">
                Add
              </Button>
            </div>

            {profile.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.skills.map(skill => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <button onClick={() => toggleSkill(skill)}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Bio / Summary</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              className="w-full bg-background/50 border border-white/20 rounded-md px-3 py-2 text-sm h-24"
            />
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold mb-2 block">Portfolio URL</label>
              <Input
                type="url"
                placeholder="https://portfolio.com"
                value={profile.portfolioLink}
                onChange={(e) => setProfile(prev => ({ ...prev, portfolioLink: e.target.value }))}
                className="bg-background/50"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">GitHub URL</label>
              <Input
                type="url"
                placeholder="https://github.com/username"
                value={profile.githubLink}
                onChange={(e) => setProfile(prev => ({ ...prev, githubLink: e.target.value }))}
                className="bg-background/50"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block">LinkedIn URL</label>
              <Input
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={profile.linkedinLink}
                onChange={(e) => setProfile(prev => ({ ...prev, linkedinLink: e.target.value }))}
                className="bg-background/50"
              />
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="text-sm font-semibold mb-2 block">Resume (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setProfile(prev => ({ ...prev, resumeFile: file.name }))
                  showToast.success('Resume uploaded', file.name)
                }
              }}
              className="w-full"
            />
            {profile.resumeFile && <p className="text-xs text-cyan-400 mt-2">📄 {profile.resumeFile}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSaveProfile}
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Profile'}
            </Button>
            <Button
              onClick={() => setIsExpanded(false)}
              variant="outline"
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
