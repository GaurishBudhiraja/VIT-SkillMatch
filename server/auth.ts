import { cookies } from 'next/headers'
import { SESSION_COOKIE_NAME } from '@/server/config'
import { createId, createSessionToken, hashToken } from '@/server/crypto'
import {
  createSession,
  deleteExpiredSessions,
  deleteSessionByTokenHash,
  getSessionByTokenHash,
} from '@/server/repositories/session-repository'
import type { SessionUser, UserRole } from '@/server/types'

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7

export async function getCurrentSessionUser(): Promise<SessionUser | null> {
  deleteExpiredSessions()
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  const session = getSessionByTokenHash(hashToken(token))
  if (!session) {
    return null
  }

  const expiresAt = String(session.expires_at || '')
  if (!expiresAt || new Date(expiresAt).getTime() <= Date.now()) {
    deleteSessionByTokenHash(hashToken(token))
    return null
  }

  return {
    id: String(session.user_id),
    email: String(session.email),
    fullName: String(session.full_name),
    role: String(session.role) as UserRole,
    createdAt: String(session.user_created_at),
  }
}

export function attachSessionCookie(response: any, userId: string) {
  const token = createSessionToken()
  createSession({
    id: createId('sess'),
    userId,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  })

  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(Date.now() + SESSION_TTL_MS),
  })
}

export async function clearSessionCookie(response: any) {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
  if (token) {
    deleteSessionByTokenHash(hashToken(token))
  }

  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(0),
  })
}
