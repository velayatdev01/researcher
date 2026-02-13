export interface User {
  id: string
  email: string
  passwordHash: string | null
  createdAt: Date
}

export interface Session {
  id: string
  userId: string
  tokenHash: string
  expiresAt: Date
  createdAt: Date
}
