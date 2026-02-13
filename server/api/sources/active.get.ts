import { createDb } from '~/src/infrastructure/db/client'
import { DrizzleSourceRepository } from '~/src/infrastructure/sources/drizzle-source.repository'
import { requireUserSession } from '~/server/utils/require-user-session'

export default defineEventHandler(async (event) => {
  const userId = await requireUserSession(event)
  const config = useRuntimeConfig(event)
  const db = createDb(config.sqlitePath)
  const repository = new DrizzleSourceRepository(db)

  const activeSource = await repository.getActiveByUser(userId)

  if (!activeSource) {
    throw createError({ statusCode: 404, statusMessage: 'No active source found for user' })
  }

  return activeSource
})
