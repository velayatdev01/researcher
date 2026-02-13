import { CreateProjectUseCase } from '~/src/application/projects/create-project.use-case'
import { createDb } from '~/src/infrastructure/db/client'
import { DrizzleProjectRepository } from '~/src/infrastructure/projects/drizzle-project.repository'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const userId = getHeader(event, 'x-user-id')

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody<{ name?: string }>(event)

  const db = createDb(config.sqlitePath)
  const repository = new DrizzleProjectRepository(db)
  const useCase = new CreateProjectUseCase(repository)

  return useCase.execute({
    userId,
    name: body.name,
  })
})
