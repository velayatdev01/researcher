import { z } from 'zod'

import type { AuthRepository } from '~/src/domain/auth/auth.repository'
import type { PasswordHasher, TokenService } from '~/src/domain/auth/crypto.port'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

export class LoginUseCase {
  constructor(
    private readonly repository: AuthRepository,
    private readonly hasher: PasswordHasher,
    private readonly tokenService: TokenService,
  ) {}

  async execute(input: unknown) {
    const validated = schema.parse(input)

    const user = await this.repository.findUserByEmail(validated.email)
    if (!user?.passwordHash) {
      throw new Error('INVALID_CREDENTIALS')
    }

    const validPassword = await this.hasher.verify(validated.password, user.passwordHash)
    if (!validPassword) {
      throw new Error('INVALID_CREDENTIALS')
    }

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
