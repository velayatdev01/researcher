import path from 'node:path'

import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

import * as schema from './schema'

export const createDb = (sqlitePath: string) => {
  const absolutePath = path.resolve(sqlitePath)
  const sqlite = new Database(absolutePath)
  return drizzle(sqlite, { schema })
}
