import type { StudentProfile, UserRole } from '@/server/types'

export function validateSignupInput(payload: {
  fullName?: string
  email?: string
  password?: string
  role?: string
  companyName?: string
  employerId?: string
}) {
  const fullName = payload.fullName?.trim()
  const email = payload.email?.trim().toLowerCase()
  const password = payload.password ?? ''
  const role = payload.role as UserRole
  const companyName = payload.companyName?.trim() || ''
  const employerId = payload.employerId?.trim() || ''

  if (!fullName) {
    throw new Error('Full name is required')
  }
  if (!email || !email.includes('@')) {
    throw new Error('A valid email is required')
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters')
  }
  if (!['student', 'employer', 'admin'].includes(role)) {
    throw new Error('A valid role is required')
  }
  if (role === 'employer') {
    if (!companyName) {
      throw new Error('Company name is required for employer signup')
    }
    if (!employerId) {
      throw new Error('Employer ID is required for employer signup')
    }
  }

  return { fullName, email, password, role, companyName, employerId }
}

export function validateLoginInput(payload: {
  email?: string
  password?: string
}) {
  const email = payload.email?.trim().toLowerCase()
  const password = payload.password ?? ''

  if (!email || !email.includes('@')) {
    throw new Error('A valid email is required')
  }
  if (!password) {
    throw new Error('Password is required')
  }

  return { email, password }
}

export function validateProfileInput(payload: any): StudentProfile {
  const cgpa =
    payload.cgpa === '' || payload.cgpa === null || payload.cgpa === undefined
      ? null
      : Number(payload.cgpa)

  if (cgpa !== null && (!Number.isFinite(cgpa) || cgpa < 0 || cgpa > 10)) {
    throw new Error('CGPA must be between 0 and 10')
  }

  const skills = Array.isArray(payload.skills)
    ? payload.skills
        .map((skill: unknown) => String(skill).trim())
        .filter(Boolean)
    : []

  return {
    cgpa,
    department: payload.department?.trim() || null,
    graduationYear: payload.graduationYear ? Number(payload.graduationYear) : null,
    domain: payload.domain?.trim() || null,
    skills,
    bio: payload.bio?.trim() || '',
    resume: payload.resume?.trim() || '',
    links: {
      portfolio: payload.links?.portfolio?.trim() || '',
      github: payload.links?.github?.trim() || '',
      linkedin: payload.links?.linkedin?.trim() || '',
    },
  }
}
