import { ensureSeedData } from '@/server/db/seed'
import { getEmployerDashboardController } from '@/server/controllers/dashboard-controller'

export const runtime = 'nodejs'

export async function GET() {
  ensureSeedData()
  return getEmployerDashboardController()
}
