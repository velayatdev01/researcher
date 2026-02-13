import { randomUUID } from 'node:crypto'

import { asc, eq } from 'drizzle-orm'

import type { Project } from '~/src/domain/projects/project.entity'
import type { CreateProjectInput, ProjectRepository } from '~/src/domain/projects/project.repository'
import type { createDb } from '~/src/infrastructure/db/client'
import { projects } from '~/src/infrastructure/db/schema'

type DbClient = ReturnType<typeof createDb>

export class DrizzleProjectRepository implements ProjectRepository {
  constructor(private readonly db: DbClient) {}

  async create(input: CreateProjectInput): Promise<Project> {
    const entity: Project = {
      id: randomUUID(),
      userId: input.userId,
      name: input.name,
      createdAt: new Date(),
    }

    await this.db.insert(projects).values(entity)
    return entity
  }

  async listByUser(userId: string): Promise<Project[]> {
    return this.db.query.projects.findMany({
      where: eq(projects.userId, userId),
      orderBy: asc(projects.createdAt),
    })
  }
}
