import { ProjectEntity } from "../features/projects/schemas/project.schemas";
import { Project } from "../features/projects/types/types.project";
import { aptFetch } from "./client";

export type CreateProjectDTO = Omit<Project, 'id'>;

export const createProject = (dto: CreateProjectDTO) => {
    return aptFetch<Project>('/projects/project', {
        method: 'POST',
        body: JSON.stringify(dto),
    });
}

export const getProjects = async (): Promise<ProjectEntity[]> => {
    const response = await aptFetch('/projects');
    return response as ProjectEntity[];
   
}
export const updateProject = (project: Project) => {
    return aptFetch<Project>(`/projects/${project.id}`, {
        method: 'PATCH',
        body: JSON.stringify(project),
    });
}

export const deleteProject = (id: string) => {
    return aptFetch<void>(`/projects/${id}`, {
        method: 'DELETE',
    });
}