import { ensureSeedData } from '@/server/db/seed'
import { loginController } from '@/server/controllers/auth-controller'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  ensureSeedData()
  return loginController(request)
}
