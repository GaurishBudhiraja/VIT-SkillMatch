import { getDatabase } from '@/server/db/connection'

export function createSession(params: {
  id: string
  userId: string
  tokenHash: string
  expiresAt: string
}) {
  const db = getDatabase()
  db.prepare(`
    INSERT INTO sessions (id, user_id, token_hash, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(params.id, params.userId, params.tokenHash, params.expiresAt)
}

export function getSessionByTokenHash(tokenHash: string) {
  const db = getDatabase()
  return db.prepare(`
    SELECT s.*, u.email, u.full_name, u.role, u.created_at as user_created_at
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ?
  `).get(tokenHash)
}

export function deleteSessionByTokenHash(tokenHash: string) {
  const db = getDatabase()
  db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash)
}

export function deleteExpiredSessions() {
  const db = getDatabase()
  db.prepare('DELETE FROM sessions WHERE expires_at <= CURRENT_TIMESTAMP').run()
}
