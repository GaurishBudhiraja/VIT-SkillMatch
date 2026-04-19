import { logoutController } from '@/server/controllers/auth-controller'

export const runtime = 'nodejs'

export async function POST() {
  return logoutController()
}
