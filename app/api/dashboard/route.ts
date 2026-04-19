import { ensureSeedData } from '@/server/db/seed'
import { getDashboardController } from '@/server/controllers/dashboard-controller'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  ensureSeedData()
  return getDashboardController(request)
}
