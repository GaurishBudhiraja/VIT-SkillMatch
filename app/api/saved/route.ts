import { getSavedController } from '@/server/controllers/dashboard-controller'

export const runtime = 'nodejs'

export async function GET() {
  return getSavedController()
}
