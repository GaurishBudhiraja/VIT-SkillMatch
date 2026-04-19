import { getDatabase } from '@/server/db/connection'
import type {
  DashboardInternship,
  EmployerApplication,
  EmployerDashboardInternship,
  StudentNotification,
} from '@/server/types'

function mapInternship(row: any): DashboardInternship {
  return {
    id: row.id,
    company: row.company_name,
    role: row.role,
    description: row.description,
    minCGPA: row.min_cgpa,
    domain: row.domain,
    duration: row.duration,
    stipend: row.stipend,
    location: row.location,
    skills: JSON.parse(row.skills_json || '[]'),
    perks: JSON.parse(row.perks_json || '[]'),
  }
}

export function listInternships(filters?: {
  search?: string
  domain?: string
  cgpa?: number | null
}) {
  const db = getDatabase()
  const conditions: string[] = []
  const values: Array<string | number> = []

  if (filters?.search) {
    conditions.push('(LOWER(company_name) LIKE ? OR LOWER(role) LIKE ? OR LOWER(description) LIKE ?)')
    const term = `%${filters.search.toLowerCase()}%`
    values.push(term, term, term)
  }

  if (filters?.domain) {
    conditions.push('domain = ?')
    values.push(filters.domain)
  }

  if (typeof filters?.cgpa === 'number') {
    conditions.push('min_cgpa <= ?')
    values.push(filters.cgpa)
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const rows = db
    .prepare(`
      SELECT *
      FROM internships
      ${whereClause}
      ORDER BY min_cgpa ASC, company_name ASC, role ASC
    `)
    .all(...values)

  return rows.map(mapInternship)
}

export function getInternshipById(internshipId: string) {
  const db = getDatabase()
  const row = db.prepare('SELECT * FROM internships WHERE id = ?').get(internshipId)
  return row ? mapInternship(row) : null
}

export function listInternshipsForCompany(companyName: string): EmployerDashboardInternship[] {
  const db = getDatabase()
  const rows = db.prepare(`
    SELECT
      i.*,
      COUNT(a.id) as application_count
    FROM internships i
    LEFT JOIN applications a
      ON a.internship_id = i.id AND a.status != 'withdrawn'
    WHERE LOWER(i.company_name) = LOWER(?)
    GROUP BY i.id
    ORDER BY application_count DESC, i.role ASC
  `).all(companyName)

  return rows.map((row: any) => ({
    ...mapInternship(row),
    applicationCount: Number(row.application_count || 0),
  }))
}

export function listSavedInternshipIds(userId: string) {
  const db = getDatabase()
  const rows = db
    .prepare('SELECT internship_id FROM saved_internships WHERE user_id = ?')
    .all(userId) as Array<{ internship_id: string }>

  return rows.map((row) => row.internship_id)
}

export function listAppliedInternshipIds(userId: string) {
  const db = getDatabase()
  const rows = db
    .prepare("SELECT internship_id FROM applications WHERE user_id = ? AND status != 'withdrawn'")
    .all(userId) as Array<{ internship_id: string }>

  return rows.map((row) => row.internship_id)
}

export function createApplication(params: {
  id: string
  userId: string
  internshipId: string
}) {
  const db = getDatabase()
  db.prepare(`
    INSERT INTO applications (id, user_id, internship_id)
    VALUES (?, ?, ?)
  `).run(params.id, params.userId, params.internshipId)
}

export function listApplications(userId: string) {
  const db = getDatabase()
  return db.prepare(`
    SELECT
      a.id,
      a.internship_id,
      a.status,
      a.applied_at,
      i.company_name,
      i.role,
      i.location,
      i.domain
    FROM applications a
    JOIN internships i ON i.id = a.internship_id
    WHERE a.user_id = ? AND a.status != 'withdrawn'
    ORDER BY a.applied_at DESC
  `).all(userId)
}

export function updateApplicationStatusForCompany(params: {
  applicationId: string
  companyName: string
  status: 'accepted' | 'rejected'
}) {
  const db = getDatabase()
  const result = db.prepare(`
    UPDATE applications
    SET status = ?
    WHERE id = ?
      AND internship_id IN (
        SELECT id FROM internships WHERE LOWER(company_name) = LOWER(?)
      )
  `).run(params.status, params.applicationId, params.companyName)

  return result.changes > 0
}

export function getApplicationByIdForCompany(applicationId: string, companyName: string) {
  const db = getDatabase()
  const row = db.prepare(`
    SELECT
      a.id,
      a.user_id,
      a.internship_id,
      a.status,
      i.company_name,
      i.role
    FROM applications a
    JOIN internships i ON i.id = a.internship_id
    WHERE a.id = ? AND LOWER(i.company_name) = LOWER(?)
  `).get(applicationId, companyName) as any

  return row
    ? {
        id: row.id,
        userId: row.user_id,
        internshipId: row.internship_id,
        status: row.status,
        companyName: row.company_name,
        internshipRole: row.role,
      }
    : null
}

export function listApplicationsForCompany(companyName: string): EmployerApplication[] {
  const db = getDatabase()
  const rows = db.prepare(`
    SELECT
      a.id,
      a.internship_id,
      a.status,
      a.applied_at,
      i.role as internship_role,
      i.company_name,
      u.id as student_id,
      u.full_name as student_name,
      u.email as student_email,
      sp.cgpa,
      sp.department,
      sp.graduation_year,
      sp.domain,
      sp.skills_json,
      sp.bio,
      sp.resume,
      sp.portfolio_url,
      sp.github_url,
      sp.linkedin_url
    FROM applications a
    JOIN internships i ON i.id = a.internship_id
    JOIN users u ON u.id = a.user_id
    LEFT JOIN student_profiles sp ON sp.user_id = u.id
    WHERE LOWER(i.company_name) = LOWER(?) AND a.status != 'withdrawn'
    ORDER BY a.applied_at DESC
  `).all(companyName)

  return rows.map((row: any) => ({
    id: row.id,
    internshipId: row.internship_id,
    internshipRole: row.internship_role,
    companyName: row.company_name,
    studentId: row.student_id,
    studentName: row.student_name,
    studentEmail: row.student_email,
    status: row.status,
    appliedAt: row.applied_at,
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
  }))
}

export function withdrawApplication(userId: string, applicationId: string) {
  const db = getDatabase()
  const result = db.prepare(`
    UPDATE applications
    SET status = 'withdrawn'
    WHERE id = ? AND user_id = ?
  `).run(applicationId, userId)

  return result.changes > 0
}

export function saveInternship(userId: string, internshipId: string) {
  const db = getDatabase()
  db.prepare(`
    INSERT OR IGNORE INTO saved_internships (user_id, internship_id)
    VALUES (?, ?)
  `).run(userId, internshipId)
}

export function removeSavedInternship(userId: string, internshipId: string) {
  const db = getDatabase()
  db.prepare(`
    DELETE FROM saved_internships
    WHERE user_id = ? AND internship_id = ?
  `).run(userId, internshipId)
}

export function listSavedInternships(userId: string) {
  const db = getDatabase()
  const rows = db.prepare(`
    SELECT i.*
    FROM saved_internships s
    JOIN internships i ON i.id = s.internship_id
    WHERE s.user_id = ?
    ORDER BY s.saved_at DESC
  `).all(userId)

  return rows.map(mapInternship)
}

export function createNotification(params: {
  id: string
  userId: string
  applicationId: string
  internshipId: string
  companyName: string
  internshipRole: string
  status: 'accepted' | 'rejected'
  title: string
  message: string
}) {
  const db = getDatabase()
  db.prepare(`
    INSERT INTO notifications (
      id, user_id, application_id, internship_id, company_name, internship_role,
      status, title, message
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    params.id,
    params.userId,
    params.applicationId,
    params.internshipId,
    params.companyName,
    params.internshipRole,
    params.status,
    params.title,
    params.message,
  )
}

export function listNotificationsForUser(userId: string): StudentNotification[] {
  const db = getDatabase()
  const rows = db.prepare(`
    SELECT *
    FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(userId) as any[]

  return rows.map((row) => ({
    id: row.id,
    applicationId: row.application_id,
    internshipId: row.internship_id,
    companyName: row.company_name,
    internshipRole: row.internship_role,
    status: row.status,
    title: row.title,
    message: row.message,
    isRead: Boolean(row.is_read),
    createdAt: row.created_at,
  }))
}

export function markNotificationsRead(userId: string) {
  const db = getDatabase()
  db.prepare(`
    UPDATE notifications
    SET is_read = 1
    WHERE user_id = ? AND is_read = 0
  `).run(userId)
}
