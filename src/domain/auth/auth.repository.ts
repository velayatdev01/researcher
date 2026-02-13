import type { Session, User } from './user.entity'

export interface RegisterInput {
  email: string
  passwordHash: string
}

export interface AuthRepository {
  findUserByEmail(email: string): Promise<User | null>
  createUser(input: RegisterInput): Promise<User>
  createSession(userId: string, tokenHash: string, expiresAt: Date): Promise<Session>
  findSessionByTokenHash(tokenHash: string): Promise<Session | null>
}
