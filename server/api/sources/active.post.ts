import { IngestSourceUseCase } from '~/src/application/sources/ingest-source.use-case'
import { createDb } from '~/src/infrastructure/db/client'
import { DrizzleSourceRepository } from '~/src/infrastructure/sources/drizzle-source.repository'
import { requireUserSession } from '~/server/utils/require-user-session'

export default defineEventHandler(async (event) => {
  const userId = await requireUserSession(event)
  const body = await readBody<{ originalFilename?: string, content?: string }>(event)
  const config = useRuntimeConfig(event)

  const db = createDb(config.sqlitePath)
  const repository = new DrizzleSourceRepository(db)
  const useCase = new IngestSourceUseCase(repository)

  try {
    return await useCase.execute({
      userId,
      originalFilename: body.originalFilename,
      content: body.content,
    })
  }
  catch (error) {
    if (error instanceof Error && error.message.startsWith('INVALID_SOURCE_FORMAT_AT_LINE_')) {
      const lineNumber = error.message.replace('INVALID_SOURCE_FORMAT_AT_LINE_', '')
      throw createError({
        statusCode: 422,
        statusMessage: `Invalid source format at line ${lineNumber}. Expected: <text>\\t<address>`,
      })
    }

    if (error instanceof Error && error.message === 'EMPTY_SOURCE_FILE') {
      throw createError({ statusCode: 422, statusMessage: 'Source file is empty' })
    }

    throw error
  }
})
