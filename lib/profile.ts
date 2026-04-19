'use client'

export interface ProfileLinks {
  portfolio: string
  github: string
  linkedin: string
}

export interface ProfileFormData {
  cgpa: string
  department: string
  graduationYear: number
  domain: string
  skills: string[]
  bio: string
  resume: string
  links: ProfileLinks
}

export const profileDepartments = ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL', 'AERO', 'AUTO']

export const profileSkillOptions = [
  'Python',
  'JavaScript',
  'Java',
  'C++',
  'React',
  'Node.js',
  'MongoDB',
  'PostgreSQL',
  'AWS',
  'Docker',
  'Kubernetes',
  'Machine Learning',
  'Data Science',
  'Mobile Dev',
  'System Design',
]

export const profileDomains = [
  'Full Stack Development',
  'Backend Development',
  'Frontend Development',
  'Mobile Development',
  'Data Science',
  'Cybersecurity',
  'Cloud Computing',
  'DevOps',
  'AI/Machine Learning',
  'Database Design',
]

function getDefaultGraduationYear() {
  return new Date().getFullYear() + 1
}

export function createEmptyProfileFormData(): ProfileFormData {
  return {
    cgpa: '',
    department: '',
    graduationYear: getDefaultGraduationYear(),
    domain: '',
    skills: [],
    bio: '',
    resume: '',
    links: {
      portfolio: '',
      github: '',
      linkedin: '',
    },
  }
}

export function normalizeProfileFormData(profile?: any): ProfileFormData {
  if (!profile) {
    return createEmptyProfileFormData()
  }

  const cgpaValue =
    typeof profile.cgpa === 'number'
      ? String(profile.cgpa)
      : typeof profile.cgpa === 'string'
        ? profile.cgpa
        : ''

  return {
    cgpa: cgpaValue,
    department: profile.department || '',
    graduationYear: Number(profile.graduationYear || profile.gradYear) || getDefaultGraduationYear(),
    domain: profile.domain || '',
    skills: Array.isArray(profile.skills) ? profile.skills : [],
    bio: profile.bio || '',
    resume: profile.resume || profile.resumeFile || '',
    links: {
      portfolio: profile.links?.portfolio || profile.portfolioLink || '',
      github: profile.links?.github || profile.githubLink || '',
      linkedin: profile.links?.linkedin || profile.linkedinLink || '',
    },
  }
}

export function buildStoredProfile(formData: ProfileFormData, existingProfile?: any) {
  const cgpa = Number.parseFloat(formData.cgpa)

  return {
    ...existingProfile,
    cgpa: Number.isFinite(cgpa) ? cgpa : 0,
    department: formData.department,
    graduationYear: Number(formData.graduationYear) || getDefaultGraduationYear(),
    gradYear: Number(formData.graduationYear) || getDefaultGraduationYear(),
    domain: formData.domain,
    skills: formData.skills,
    bio: formData.bio,
    resume: formData.resume,
    resumeFile: formData.resume,
    links: {
      portfolio: formData.links.portfolio,
      github: formData.links.github,
      linkedin: formData.links.linkedin,
    },
    portfolioLink: formData.links.portfolio,
    githubLink: formData.links.github,
    linkedinLink: formData.links.linkedin,
  }
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null

  const userStr = localStorage.getItem('currentUser')
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function saveCurrentUserProfile(formData: ProfileFormData) {
  if (typeof window === 'undefined') return null

  const currentUser = getCurrentUser()
  if (!currentUser) return null

  const updatedUser = {
    ...currentUser,
    profileCompleted: true,
    profile: buildStoredProfile(formData, currentUser.profile),
  }

  localStorage.setItem('currentUser', JSON.stringify(updatedUser))

  const usersStr = localStorage.getItem('users')
  if (usersStr) {
    try {
      const users = JSON.parse(usersStr)
      if (Array.isArray(users)) {
        const updatedUsers = users.map((user) =>
          user.id === updatedUser.id ? { ...user, profileCompleted: true, profile: updatedUser.profile } : user
        )
        localStorage.setItem('users', JSON.stringify(updatedUsers))
      }
    } catch {
      // Ignore malformed user lists and keep the active session updated.
    }
  }

  return updatedUser
}
