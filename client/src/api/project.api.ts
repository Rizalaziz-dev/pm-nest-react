import { CreateProjectFormData, ProjectEntity } from "../features/projects/schemas/project.schemas";
import { Project } from "../features/projects/types/project.types";
import { aptFetch } from "./client";

// export type CreateProjectDTO = Omit<Project, 'id'>;
export interface DistributeWorkOrderDto {
    projectId: string;
    operatorIds: string[]; // The array of 6 engineer IDs
}

export const createProject = (dto: CreateProjectFormData) => {
    return aptFetch<Project>('/projects/project', {
        method: 'POST',
        body: JSON.stringify(dto),
    });
}

export const createBulkProjects = (projects: CreateProjectFormData[]) => {
    return aptFetch<ProjectEntity[]>('/projects/bulk', {
        method: 'POST',
        body: JSON.stringify(projects),
    });
}

export const getProjects = async (): Promise<ProjectEntity[]> => {
    const response = await aptFetch('/projects');
    return response as ProjectEntity[];
   
}

export const getProjectById = async (id: string): Promise<Project> => {
    const response = await aptFetch(`/projects/${id}`);
    return response as Project;
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

export const distributeToEngineers = (dto: DistributeWorkOrderDto) => {
    // Hits the POST /projects/:id/distribute endpoint
    return aptFetch(`/projects/${dto.projectId}/distribute`, {
        method: 'POST',
        body: JSON.stringify({ operatorIds: dto.operatorIds }),
    });
}