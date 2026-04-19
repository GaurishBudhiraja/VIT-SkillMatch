import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'

export function createId(prefix: string) {
  return `${prefix}_${randomUUID()}`
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const derived = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${derived}`
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(':')
  if (!salt || !hash) {
    return false
  }

  const derived = scryptSync(password, salt, 64)
  const hashBuffer = Buffer.from(hash, 'hex')

  if (derived.length !== hashBuffer.length) {
    return false
  }

  return timingSafeEqual(derived, hashBuffer)
}

export function createSessionToken() {
  return randomBytes(32).toString('hex')
}

export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}
