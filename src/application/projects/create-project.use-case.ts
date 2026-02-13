import { z } from 'zod'

import type { Project } from '~/src/domain/projects/project.entity'
import type { ProjectRepository } from '~/src/domain/projects/project.repository'

const schema = z.object({
  userId: z.string().min(1),
  name: z.string().min(2).max(120),
})

export class CreateProjectUseCase {
  constructor(private readonly repository: ProjectRepository) {}

  async execute(input: unknown): Promise<Project> {
    const validated = schema.parse(input)
    return this.repository.create(validated)
  }
}
