import { ensureSeedData } from '@/server/db/seed'
import { signupController } from '@/server/controllers/auth-controller'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  ensureSeedData()
  return signupController(request)
}
