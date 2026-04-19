
import { getDatabase } from '@/server/db/connection'
import type { EmployerProfile, SessionUser, StudentProfile, UserRole } from '@/server/types'

function mapUser(row: any): SessionUser {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
    createdAt: row.created_at,
  }
}

function mapProfile(row: any): StudentProfile | null {
  if (!row) {
    return null
  }

  return {
    cgpa: row.cgpa ?? null,
    department: row.department ?? null,
    graduationYear: row.graduation_year ?? null,
    domain: row.domain ?? null,
    skills: JSON.parse(row.skills_json || '[]'),
    bio: row.bio || '',
    resume: row.resume || '',
    links: {
      portfolio: row.portfolio_url || '',
      github: row.github_url || '',
      linkedin: row.linkedin_url || '',
    },
  }
}

function mapEmployerProfile(row: any): EmployerProfile | null {
  if (!row) {
    return null
  }

  return {
    companyName: row.company_name,
    employerId: row.employer_id,
  }
}

export function createUser(params: {
  id: string
  email: string
  fullName: string
  passwordHash: string
  role: UserRole
  employerProfile?: EmployerProfile
}) {
  const db = getDatabase()
  db.prepare(`
    INSERT INTO users (id, email, full_name, password_hash, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    params.id,
    params.email.toLowerCase(),
    params.fullName,
    params.passwordHash,
    params.role,
  )

  if (params.role === 'employer' && params.employerProfile) {
    db.prepare(`
      INSERT INTO employer_profiles (user_id, company_name, employer_id)
      VALUES (?, ?, ?)
    `).run(
      params.id,
      params.employerProfile.companyName,
      params.employerProfile.employerId,
    )
  }

  return getUserById(params.id)
}

export function getUserByEmail(email: string) {
  const db = getDatabase()
  const row = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(email.toLowerCase())
  return row
    ? { ...mapUser(row), passwordHash: String(row.password_hash) }
    : null
}

export function getUserById(id: string) {
  const db = getDatabase()
  const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id)
  return row ? mapUser(row) : null
}

export function upsertStudentProfile(userId: string, profile: StudentProfile) {
  const db = getDatabase()
  db.prepare(`
    INSERT INTO student_profiles (
      user_id, cgpa, department, graduation_year, domain, bio, resume,
      portfolio_url, github_url, linkedin_url, skills_json, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET
      cgpa = excluded.cgpa,
      department = excluded.department,
      graduation_year = excluded.graduation_year,
      domain = excluded.domain,
      bio = excluded.bio,
      resume = excluded.resume,
      portfolio_url = excluded.portfolio_url,
      github_url = excluded.github_url,
      linkedin_url = excluded.linkedin_url,
      skills_json = excluded.skills_json,
      updated_at = CURRENT_TIMESTAMP
  `).run(
    userId,
    profile.cgpa,
    profile.department,
    profile.graduationYear,
    profile.domain,
    profile.bio,
    profile.resume,
    profile.links.portfolio,
    profile.links.github,
    profile.links.linkedin,
    JSON.stringify(profile.skills),
  )

  return getStudentProfileByUserId(userId)
}

export function getStudentProfileByUserId(userId: string) {
  const db = getDatabase()
  const row = db
    .prepare('SELECT * FROM student_profiles WHERE user_id = ?')
    .get(userId)
  return mapProfile(row)
}

export function getEmployerProfileByUserId(userId: string) {
  const db = getDatabase()
  const row = db
    .prepare('SELECT * FROM employer_profiles WHERE user_id = ?')
    .get(userId)
  return mapEmployerProfile(row)
}
