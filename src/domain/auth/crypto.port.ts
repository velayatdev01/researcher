export interface PasswordHasher {
  hash(plain: string): Promise<string>
  verify(plain: string, hashed: string): Promise<boolean>
}

export interface TokenService {
  generateRawToken(): string
  hashToken(rawToken: string): string
}
