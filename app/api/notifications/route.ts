import { getNotificationsController, readNotificationsController } from '@/server/controllers/dashboard-controller'

export const runtime = 'nodejs'

export async function GET() {
  return getNotificationsController()
}

export async function PATCH() {
  return readNotificationsController()
}
