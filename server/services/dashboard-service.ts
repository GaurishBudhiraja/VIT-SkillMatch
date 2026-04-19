import { createId } from '@/server/crypto'
import {
  createApplication,
  createNotification,
  getApplicationByIdForCompany,
  getInternshipById,
  listAppliedInternshipIds,
  listApplicationsForCompany,
  listApplications,
  listInternships,
  listInternshipsForCompany,
  listNotificationsForUser,
  listSavedInternshipIds,
  listSavedInternships,
  markNotificationsRead,
  removeSavedInternship,
  saveInternship,
  updateApplicationStatusForCompany,
  withdrawApplication,
} from '@/server/repositories/internship-repository'
import {
  getEmployerProfileByUserId,
  getStudentProfileByUserId,
} from '@/server/repositories/user-repository'

export function getDashboardData(
  userId: string,
  filters?: { search?: string; domain?: string },
) {
  const profile = getStudentProfileByUserId(userId)
  const internships = listInternships({
    search: filters?.search,
    domain: filters?.domain,
    cgpa: profile?.cgpa ?? null,
  })
  const appliedIds = listAppliedInternshipIds(userId)
  const savedIds = listSavedInternshipIds(userId)

  return {
    profile,
    internships,
    appliedIds,
    savedIds,
  }
}

export function applyToInternship(userId: string, internshipId: string) {
  const internship = getInternshipById(internshipId)
  if (!internship) {
    throw new Error('Internship not found')
  }
  if (listAppliedInternshipIds(userId).includes(internshipId)) {
    throw new Error('You have already applied to this internship')
  }

  createApplication({
    id: createId('app'),
    userId,
    internshipId,
  })

  return internship
}

export function getInternshipDetail(userId: string, internshipId: string) {
  const internship = getInternshipById(internshipId)
  if (!internship) {
    throw new Error('Internship not found')
  }

  const appliedIds = listAppliedInternshipIds(userId)
  const savedIds = listSavedInternshipIds(userId)

  return {
    internship,
    applied: appliedIds.includes(internshipId),
    saved: savedIds.includes(internshipId),
  }
}

export function toggleSavedInternship(
  userId: string,
  internshipId: string,
  shouldSave: boolean,
) {
  const internship = getInternshipById(internshipId)
  if (!internship) {
    throw new Error('Internship not found')
  }

  if (shouldSave) {
    saveInternship(userId, internshipId)
  } else {
    removeSavedInternship(userId, internshipId)
  }

  return internship
}

export function getSavedInternshipsForUser(userId: string) {
  return listSavedInternships(userId)
}

export function getApplicationsForUser(userId: string) {
  return listApplications(userId)
}

export function withdrawApplicationForUser(userId: string, applicationId: string) {
  const success = withdrawApplication(userId, applicationId)
  if (!success) {
    throw new Error('Application not found')
  }
}

export function getEmployerDashboardData(userId: string) {
  const employerProfile = getEmployerProfileByUserId(userId)
  if (!employerProfile) {
    throw new Error('Employer profile not found')
  }

  const internships = listInternshipsForCompany(employerProfile.companyName)
  const applications = listApplicationsForCompany(employerProfile.companyName)

  return {
    employerProfile,
    internships,
    applications,
  }
}

export function updateEmployerApplicationStatus(userId: string, applicationId: string, status: 'accepted' | 'rejected') {
  const employerProfile = getEmployerProfileByUserId(userId)
  if (!employerProfile) {
    throw new Error('Employer profile not found')
  }

  const application = getApplicationByIdForCompany(applicationId, employerProfile.companyName)
  if (!application) {
    throw new Error('Application not found')
  }

  if (!['applied', 'reviewing', 'shortlisted', 'accepted', 'rejected'].includes(application.status)) {
    throw new Error('Application cannot be updated')
  }

  const updated = updateApplicationStatusForCompany({
    applicationId,
    companyName: employerProfile.companyName,
    status,
  })

  if (!updated) {
    throw new Error('Unable to update application')
  }

  createNotification({
    id: createId('notif'),
    userId: application.userId,
    applicationId: application.id,
    internshipId: application.internshipId,
    companyName: application.companyName,
    internshipRole: application.internshipRole,
    status,
    title: `${application.companyName} ${status} your application`,
    message: `${application.companyName} ${status} your application for ${application.internshipRole}.`,
  })

  return {
    ...application,
    status,
  }
}

export function getNotificationsForUser(userId: string) {
  return listNotificationsForUser(userId)
}

export function markNotificationsAsReadForUser(userId: string) {
  markNotificationsRead(userId)
}
