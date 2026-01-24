import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createProject, getProjects, updateProject, deleteProject } from "../../../api/project.api";


// Service Hook Methode
export function useProjects() {
    const queryClient = useQueryClient();

    const projectQuery = useQuery({
        queryKey: ['projects'],
        queryFn: getProjects,
        
    });

    const createProjectMutation = useMutation({
        mutationFn: createProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });

    const updateProjectMutation = useMutation({
        mutationFn: updateProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });

    const deleteProjectMutation = useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });

    return {
        // Query State
        data: projectQuery.data,
        isPending: projectQuery.isPending,
        isError: projectQuery.isError,

        // Mutations
        createProject: createProjectMutation.mutate,
        isCreating: createProjectMutation.isPending, 

        updateProject: updateProjectMutation.mutate,
        isUpdating: updateProjectMutation.isPending,

        deleteProject: deleteProjectMutation.mutate,
        isDeleting: deleteProjectMutation.isPending,
    
    };
}