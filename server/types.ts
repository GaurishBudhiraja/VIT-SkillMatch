export type UserRole = 'student' | 'employer' | 'admin'

export interface SessionUser {
  id: string
  email: string
  fullName: string
  role: UserRole
  createdAt: string
}

export interface EmployerProfile {
  companyName: string
  employerId: string
}

export interface StudentProfile {
  cgpa: number | null
  department: string | null
  graduationYear: number | null
  domain: string | null
  skills: string[]
  bio: string
  resume: string
  links: {
    portfolio: string
    github: string
    linkedin: string
  }
}

export interface DashboardInternship {
  id: string
  company: string
  role: string
  description: string
  minCGPA: number
  domain: string
  duration: string
  stipend: string
  location: string
  skills: string[]
  perks: string[]
}

export interface EmployerDashboardInternship extends DashboardInternship {
  applicationCount: number
}

export interface EmployerApplication {
  id: string
  internshipId: string
  internshipRole: string
  companyName: string
  studentId: string
  studentName: string
  studentEmail: string
  status: string
  appliedAt: string
  cgpa: number | null
  department: string | null
  graduationYear: number | null
  domain: string | null
  skills: string[]
  bio: string
  resume: string
  links: {
    portfolio: string
    github: string
    linkedin: string
  }
}

export interface StudentNotification {
  id: string
  applicationId: string
  internshipId: string
  companyName: string
  internshipRole: string
  status: 'accepted' | 'rejected'
  title: string
  message: string
  isRead: boolean
  createdAt: string
}
