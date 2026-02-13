import { randomUUID } from 'node:crypto'

import { and, desc, eq, sql } from 'drizzle-orm'

import type { ActiveSourceResult, CreateSourceInput, IngestedSourceResult, SourceRepository } from '~/src/domain/sources/source.repository'
import type { createDb } from '~/src/infrastructure/db/client'
import { sourceNotes, sources } from '~/src/infrastructure/db/schema'

type DbClient = ReturnType<typeof createDb>

export class DrizzleSourceRepository implements SourceRepository {
  constructor(private readonly db: DbClient) {}

  async createAndActivate(input: CreateSourceInput): Promise<IngestedSourceResult> {
    const sourceId = randomUUID()
    const createdAt = new Date()

    await this.db.transaction(async (tx) => {
      await tx
        .update(sources)
        .set({ isActive: false })
        .where(and(eq(sources.userId, input.userId), eq(sources.isActive, true)))

      await tx.insert(sources).values({
        id: sourceId,
        userId: input.userId,
        fileHash: input.fileHash,
        originalFilename: input.originalFilename,
        rawText: input.rawText,
        isActive: true,
        createdAt,
      })

      if (input.notes.length > 0) {
        await tx.insert(sourceNotes).values(input.notes.map(note => ({
          id: randomUUID(),
          sourceId,
          sourceOrder: note.sourceOrder,
          text: note.text,
          address: note.address,
          textHash: note.textHash,
        })))
      }
    })

    return {
      source: {
        id: sourceId,
        userId: input.userId,
        fileHash: input.fileHash,
        originalFilename: input.originalFilename,
        rawText: input.rawText,
        isActive: true,
        createdAt,
      },
      noteCount: input.notes.length,
    }
  }

  async getActiveByUser(userId: string): Promise<ActiveSourceResult | null> {
    const source = await this.db.query.sources.findFirst({
      where: and(eq(sources.userId, userId), eq(sources.isActive, true)),
      orderBy: desc(sources.createdAt),
    })

    if (!source) {
      return null
    }

    const countResult = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(sourceNotes)
      .where(eq(sourceNotes.sourceId, source.id))

    return {
      source,
      noteCount: Number(countResult[0]?.count ?? 0),
    }
  }
}
