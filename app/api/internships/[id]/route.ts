import { ensureSeedData } from '@/server/db/seed'
import { getInternshipController } from '@/server/controllers/dashboard-controller'

export const runtime = 'nodejs'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  ensureSeedData()
  const params = await context.params
  return getInternshipController(request, params)
}
