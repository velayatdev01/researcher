import type { H3Event } from 'h3'

import { createDb } from '~/src/infrastructure/db/client'
import { DrizzleAuthRepository } from '~/src/infrastructure/auth/drizzle-auth.repository'
import { Sha256TokenService } from '~/src/infrastructure/auth/node-crypto.service'

export const requireUserSession = async (event: H3Event) => {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '').trim()

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const config = useRuntimeConfig(event)
  const db = createDb(config.sqlitePath)
  const repository = new DrizzleAuthRepository(db)
  const tokenService = new Sha256TokenService()
  const tokenHash = tokenService.hashToken(token)
  const session = await repository.findSessionByTokenHash(tokenHash)

  if (!session) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid session' })
  }

  return session.userId
}
