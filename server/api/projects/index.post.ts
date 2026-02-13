import { CreateProjectUseCase } from '~/src/application/projects/create-project.use-case'
import { createDb } from '~/src/infrastructure/db/client'
import { DrizzleProjectRepository } from '~/src/infrastructure/projects/drizzle-project.repository'
import { requireUserSession } from '~/server/utils/require-user-session'

export default defineEventHandler(async (event) => {
  const userId = await requireUserSession(event)
  const body = await readBody<{ name?: string }>(event)
  const config = useRuntimeConfig(event)

  const db = createDb(config.sqlitePath)
  const repository = new DrizzleProjectRepository(db)
  const useCase = new CreateProjectUseCase(repository)

  return useCase.execute({ userId, name: body.name })
})
