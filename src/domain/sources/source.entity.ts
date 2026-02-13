export interface Source {
  id: string
  userId: string
  fileHash: string
  originalFilename: string
  rawText: string
  isActive: boolean
  createdAt: Date
}

export interface SourceNote {
  id: string
  sourceId: string
  sourceOrder: number
  text: string
  address: string
  textHash: string
}
