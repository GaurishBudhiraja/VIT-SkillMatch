import { ensureSeedData } from '@/server/db/seed'
import { applyController } from '@/server/controllers/dashboard-controller'

export const runtime = 'nodejs'

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  ensureSeedData()
  const params = await context.params
  return applyController(request, params)
}
