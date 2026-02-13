import { LoginUseCase } from '~/src/application/auth/login.use-case'
import { createDb } from '~/src/infrastructure/db/client'
import { DrizzleAuthRepository } from '~/src/infrastructure/auth/drizzle-auth.repository'
import { NodePasswordHasher, Sha256TokenService } from '~/src/infrastructure/auth/node-crypto.service'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string, password?: string }>(event)
  const config = useRuntimeConfig(event)

  const db = createDb(config.sqlitePath)
  const repository = new DrizzleAuthRepository(db)
  const useCase = new LoginUseCase(repository, new NodePasswordHasher(), new Sha256TokenService())

  try {
    return await useCase.execute(body)
  }
  catch (error) {
    if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
      throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
    }
    throw error
  }
})
