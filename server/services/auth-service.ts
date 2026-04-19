import { createId, hashPassword, verifyPassword } from '@/server/crypto'
import { createUser, getUserByEmail } from '@/server/repositories/user-repository'
import { validateLoginInput, validateSignupInput } from '@/server/validation'

export function signupUser(payload: {
  fullName?: string
  email?: string
  password?: string
  role?: string
  companyName?: string
  employerId?: string
}) {
  const input = validateSignupInput(payload)
  const existingUser = getUserByEmail(input.email)
  if (existingUser) {
    throw new Error('Email already registered')
  }

  return createUser({
    id: createId('user'),
    email: input.email,
    fullName: input.fullName,
    passwordHash: hashPassword(input.password),
    role: input.role,
    employerProfile:
      input.role === 'employer'
        ? {
            companyName: input.companyName,
            employerId: input.employerId,
          }
        : undefined,
  })
}

export function loginUser(payload: { email?: string; password?: string }) {
  const input = validateLoginInput(payload)
  const user = getUserByEmail(input.email)
  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    throw new Error('Invalid email or password')
  }

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    createdAt: user.createdAt,
  }
}
