import { ensureSeedData } from '@/server/db/seed'
import { updateEmployerApplicationStatusController } from '@/server/controllers/dashboard-controller'

export const runtime = 'nodejs'

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  ensureSeedData()
  const params = await context.params
  return updateEmployerApplicationStatusController(request, params)
}
