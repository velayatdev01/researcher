import type { Source, SourceNote } from './source.entity'

export interface CreateSourceInput {
  userId: string
  originalFilename: string
  rawText: string
  fileHash: string
  notes: Omit<SourceNote, 'id' | 'sourceId'>[]
}

export interface IngestedSourceResult {
  source: Source
  noteCount: number
}

export interface ActiveSourceResult {
  source: Source
  noteCount: number
}

export interface SourceRepository {
  createAndActivate(input: CreateSourceInput): Promise<IngestedSourceResult>
  getActiveByUser(userId: string): Promise<ActiveSourceResult | null>
}
