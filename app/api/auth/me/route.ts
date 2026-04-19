import { meController } from '@/server/controllers/auth-controller'

export const runtime = 'nodejs'

export async function GET() {
  return meController()
}
