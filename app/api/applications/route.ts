import {
  deleteApplicationController,
  getApplicationsController,
} from '@/server/controllers/dashboard-controller'

export const runtime = 'nodejs'

export async function GET() {
  return getApplicationsController()
}

export async function DELETE(request: Request) {
  return deleteApplicationController(request)
}
