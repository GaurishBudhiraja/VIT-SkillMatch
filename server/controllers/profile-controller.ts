import { getCurrentSessionUser } from '@/server/auth'
import { fail, ok } from '@/server/http'
import { getProfileForUser, saveProfileForUser } from '@/server/services/profile-service'

export async function getProfileController() {
  const user = await getCurrentSessionUser()
  if (!user) {
    return fail('Unauthorized', 401)
  }

  return ok({
    user,
    profile: getProfileForUser(user.id),
  })
}

export async function updateProfileController(request: Request) {
  try {
    const user = await getCurrentSessionUser()
    if (!user) {
      return fail('Unauthorized', 401)
    }

    const body = await request.json()
    const profile = saveProfileForUser(user.id, body)
    return ok({ user, profile })
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Unable to save profile', 400)
  }
}
