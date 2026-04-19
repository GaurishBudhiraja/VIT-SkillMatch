import { getProfileController, updateProfileController } from '@/server/controllers/profile-controller'

export const runtime = 'nodejs'

export async function GET() {
  return getProfileController()
}

export async function PUT(request: Request) {
  return updateProfileController(request)
}
