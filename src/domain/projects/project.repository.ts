import type { Project } from './project.entity'

export interface CreateProjectInput {
  userId: string
  name: string
}

export interface ProjectRepository {
  create(input: CreateProjectInput): Promise<Project>
  listByUser(userId: string): Promise<Project[]>
}
