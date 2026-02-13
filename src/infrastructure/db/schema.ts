import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const sources = sqliteTable('sources', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  fileHash: text('file_hash').notNull(),
  originalFilename: text('original_filename').notNull(),
  rawText: text('raw_text').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const sourceNotes = sqliteTable('source_notes', {
  id: text('id').primaryKey(),
  sourceId: text('source_id').notNull().references(() => sources.id),
  sourceOrder: integer('source_order').notNull(),
  text: text('text').notNull(),
  address: text('address').notNull(),
  textHash: text('text_hash').notNull(),
})
