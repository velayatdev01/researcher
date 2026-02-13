import { createDb } from '~/src/infrastructure/db/client'
import { DrizzleProjectRepository } from '~/src/infrastructure/projects/drizzle-project.repository'
import { requireUserSession } from '~/server/utils/require-user-session'

export default defineEventHandler(async (event) => {
  const userId = await requireUserSession(event)
  const config = useRuntimeConfig(event)
  const db = createDb(config.sqlitePath)
  const repository = new DrizzleProjectRepository(db)

  return repository.listByUser(userId)
})
