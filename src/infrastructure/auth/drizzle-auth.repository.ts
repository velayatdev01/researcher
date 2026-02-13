import { randomUUID } from 'node:crypto'

import { and, eq, gt } from 'drizzle-orm'

import type { AuthRepository, RegisterInput } from '~/src/domain/auth/auth.repository'
import type { Session, User } from '~/src/domain/auth/user.entity'
import type { createDb } from '~/src/infrastructure/db/client'
import { sessions, users } from '~/src/infrastructure/db/schema'

type DbClient = ReturnType<typeof createDb>

export class DrizzleAuthRepository implements AuthRepository {
  constructor(private readonly db: DbClient) {}

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.email, email),
    })
    return user ?? null
  }

  async createUser(input: RegisterInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      email: input.email,
      passwordHash: input.passwordHash,
      createdAt: new Date(),
    }

    await this.db.insert(users).values(user)
    return user
  }

  async createSession(userId: string, tokenHash: string, expiresAt: Date): Promise<Session> {
    const session: Session = {
      id: randomUUID(),
      userId,
      tokenHash,
      expiresAt,
      createdAt: new Date(),
    }

    await this.db.insert(sessions).values(session)
    return session
  }

  async findSessionByTokenHash(tokenHash: string): Promise<Session | null> {
    const session = await this.db.query.sessions.findFirst({
      where: and(eq(sessions.tokenHash, tokenHash), gt(sessions.expiresAt, new Date())),
    })
    return session ?? null
  }
}
