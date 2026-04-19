import { getStudentProfileByUserId, upsertStudentProfile } from '@/server/repositories/user-repository'
import { validateProfileInput } from '@/server/validation'

export function getProfileForUser(userId: string) {
  return getStudentProfileByUserId(userId)
}

export function saveProfileForUser(userId: string, payload: any) {
  const profile = validateProfileInput(payload)
  return upsertStudentProfile(userId, profile)
}
