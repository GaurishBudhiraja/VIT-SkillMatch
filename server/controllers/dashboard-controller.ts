import { getCurrentSessionUser } from '@/server/auth'
import { fail, ok } from '@/server/http'
import {
  applyToInternship,
  getEmployerDashboardData,
  getInternshipDetail,
  getNotificationsForUser,
  getApplicationsForUser,
  getDashboardData,
  getSavedInternshipsForUser,
  markNotificationsAsReadForUser,
  toggleSavedInternship,
  updateEmployerApplicationStatus,
  withdrawApplicationForUser,
} from '@/server/services/dashboard-service'

async function requireUser() {
  const user = await getCurrentSessionUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function getDashboardController(request: Request) {
  try {
    const user = await requireUser()
    if (user.role !== 'student') {
      return fail('Student dashboard only', 403)
    }
    const { searchParams } = new URL(request.url)
    return ok({
      user,
      ...getDashboardData(user.id, {
        search: searchParams.get('search') || undefined,
        domain: searchParams.get('domain') || undefined,
      }),
    })
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Unable to load dashboard', 401)
  }
}

export async function getApplicationsController() {
  try {
    const user = await requireUser()
    if (user.role !== 'student') {
      return fail('Student applications only', 403)
    }
    return ok({ applications: getApplicationsForUser(user.id) })
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Unable to load applications', 401)
  }
}

export async function deleteApplicationController(request: Request) {
  try {
    const user = await requireUser()
    if (user.role !== 'student') {
      return fail('Student applications only', 403)
    }
    const { applicationId } = await request.json()
    withdrawApplicationForUser(user.id, String(applicationId))
    return ok({ removed: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to withdraw application'
    return fail(message, message === 'Unauthorized' ? 401 : 400)
  }
}

export async function getSavedController() {
  try {
    const user = await requireUser()
    if (user.role !== 'student') {
      return fail('Student saved internships only', 403)
    }
    return ok({ internships: getSavedInternshipsForUser(user.id) })
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Unable to load saved internships', 401)
  }
}

export async function applyController(
  _request: Request,
  params: { id: string },
) {
  try {
    const user = await requireUser()
    if (user.role !== 'student') {
      return fail('Students only', 403)
    }
    const internship = applyToInternship(user.id, params.id)
    return ok({ internship })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to apply'
    return fail(message, message === 'Unauthorized' ? 401 : 400)
  }
}

export async function saveController(
  request: Request,
  params: { id: string },
) {
  try {
    const user = await requireUser()
    if (user.role !== 'student') {
      return fail('Students only', 403)
    }
    const body = await request.json()
    const internship = toggleSavedInternship(user.id, params.id, Boolean(body.saved))
    return ok({ internship, saved: Boolean(body.saved) })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update saved internships'
    return fail(message, message === 'Unauthorized' ? 401 : 400)
  }
}

export async function getInternshipController(
  _request: Request,
  params: { id: string },
) {
  try {
    const user = await requireUser()
    if (user.role !== 'student') {
      return fail('Students only', 403)
    }
    return ok(getInternshipDetail(user.id, params.id))
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load internship'
    return fail(message, message === 'Unauthorized' ? 401 : 400)
  }
}

export async function getEmployerDashboardController() {
  try {
    const user = await requireUser()
    if (user.role !== 'employer') {
      return fail('Employer dashboard only', 403)
    }

    return ok({
      user,
      ...getEmployerDashboardData(user.id),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load employer dashboard'
    return fail(message, message === 'Unauthorized' ? 401 : 400)
  }
}

export async function updateEmployerApplicationStatusController(
  request: Request,
  params: { id: string },
) {
  try {
    const user = await requireUser()
    if (user.role !== 'employer') {
      return fail('Employers only', 403)
    }

    const body = await request.json()
    const status = body.status as 'accepted' | 'rejected'
    if (!['accepted', 'rejected'].includes(status)) {
      return fail('A valid status is required', 400)
    }

    const application = updateEmployerApplicationStatus(user.id, params.id, status)
    return ok({ application })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update application'
    return fail(message, message === 'Unauthorized' ? 401 : 400)
  }
}

export async function getNotificationsController() {
  try {
    const user = await requireUser()
    if (user.role !== 'student') {
      return fail('Students only', 403)
    }

    return ok({ notifications: getNotificationsForUser(user.id) })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load notifications'
    return fail(message, message === 'Unauthorized' ? 401 : 400)
  }
}

export async function readNotificationsController() {
  try {
    const user = await requireUser()
    if (user.role !== 'student') {
      return fail('Students only', 403)
    }

    markNotificationsAsReadForUser(user.id)
    return ok({ updated: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update notifications'
    return fail(message, message === 'Unauthorized' ? 401 : 400)
  }
}
