import { NextResponse } from 'next/server'
import { attachSessionCookie, clearSessionCookie, getCurrentSessionUser } from '@/server/auth'
import { fail, ok } from '@/server/http'
import { signupUser, loginUser } from '@/server/services/auth-service'

export async function signupController(request: Request) {
  try {
    const body = await request.json()
    const user = signupUser(body)
    const response = ok({ user }, { status: 201 })
    attachSessionCookie(response, user!.id)
    return response
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Unable to sign up', 400)
  }
}

export async function loginController(request: Request) {
  try {
    const body = await request.json()
    const user = loginUser(body)
    const response = ok({ user })
    attachSessionCookie(response, user.id)
    return response
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Unable to log in', 400)
  }
}

export async function meController() {
  const user = await getCurrentSessionUser()
  if (!user) {
    return fail('Unauthorized', 401)
  }

  return ok({ user })
}

export async function logoutController() {
  const response = NextResponse.json({ success: true, data: { loggedOut: true } })
  await clearSessionCookie(response)
  return response
}
