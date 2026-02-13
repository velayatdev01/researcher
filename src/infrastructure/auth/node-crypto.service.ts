import { randomBytes, scrypt as nodeScrypt, timingSafeEqual, createHash } from 'node:crypto'
import { promisify } from 'node:util'

import type { PasswordHasher, TokenService } from '~/src/domain/auth/crypto.port'

const scrypt = promisify(nodeScrypt)

export class NodePasswordHasher implements PasswordHasher {
  async hash(plain: string): Promise<string> {
    const salt = randomBytes(16)
    const derivedKey = await scrypt(plain, salt, 64) as Buffer
    return `${salt.toString('hex')}:${derivedKey.toString('hex')}`
  }

  async verify(plain: string, hashed: string): Promise<boolean> {
    const [saltHex, keyHex] = hashed.split(':')
    if (!saltHex || !keyHex) {
      return false
    }

    const salt = Buffer.from(saltHex, 'hex')
    const key = Buffer.from(keyHex, 'hex')
    const derivedKey = await scrypt(plain, salt, 64) as Buffer

    if (derivedKey.length !== key.length) {
      return false
    }

    return timingSafeEqual(derivedKey, key)
  }
}

export class Sha256TokenService implements TokenService {
  generateRawToken(): string {
    return randomBytes(32).toString('hex')
  }

  hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex')
  }
}
