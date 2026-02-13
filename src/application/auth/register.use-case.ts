import { z } from 'zod'

import type { AuthRepository } from '~/src/domain/auth/auth.repository'
import type { PasswordHasher, TokenService } from '~/src/domain/auth/crypto.port'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

export class RegisterUseCase {
  constructor(
    private readonly repository: AuthRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: unknown) {
    const validated = schema.parse(input)

    const existingUser = await this.repository.findUserByEmail(validated.email)
    if (existingUser) {
      throw new Error('EMAIL_EXISTS')
    }

    const passwordHash = await this.hasher.hash(validated.password)
    const user = await this.repository.createUser({
      email: validated.email,
      passwordHash,
    })

    const rawToken = this.tokenService.generateRawToken()
    const tokenHash = this.tokenService.hashToken(rawToken)
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14)
    await this.repository.createSession(user.id, tokenHash, expiresAt)

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      token: rawToken,
      expiresAt,
    }
  }
}
