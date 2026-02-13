import { DrizzleProjectRepository } from '~/src/infrastructure/projects/drizzle-project.repository'
import { createDb } from '~/src/infrastructure/db/client'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const userId = getHeader(event, 'x-user-id')

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const db = createDb(config.sqlitePath)
  const repository = new DrizzleProjectRepository(db)
  return repository.listByUser(userId)
})
