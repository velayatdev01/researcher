import { createHash } from 'node:crypto'

import { z } from 'zod'

import type { SourceRepository } from '~/src/domain/sources/source.repository'

const schema = z.object({
  userId: z.string().min(1),
  originalFilename: z.string().min(1).max(260),
  content: z.string().min(1),
})

const textHash = (value: string) => createHash('sha256').update(value).digest('hex')

export class IngestSourceUseCase {
  constructor(private readonly repository: SourceRepository) {}

  async execute(input: unknown) {
    const validated = schema.parse(input)

    const lines = validated.content
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)

    const notes = lines.map((line, index) => {
      const firstTabIndex = line.indexOf('\t')
      if (firstTabIndex <= 0 || firstTabIndex === line.length - 1) {
        throw new Error(`INVALID_SOURCE_FORMAT_AT_LINE_${index + 1}`)
      }

      const text = line.slice(0, firstTabIndex).trim()
      const address = line.slice(firstTabIndex + 1).trim()

      if (!text || !address) {
        throw new Error(`INVALID_SOURCE_FORMAT_AT_LINE_${index + 1}`)
      }

      return {
        sourceOrder: index,
        text,
        address,
        textHash: textHash(text),
      }
    })

    if (notes.length === 0) {
      throw new Error('EMPTY_SOURCE_FILE')
    }

    return this.repository.createAndActivate({
      userId: validated.userId,
      originalFilename: validated.originalFilename,
      rawText: validated.content,
      fileHash: textHash(validated.content),
      notes,
    })
  }
}
