import { useMutation, useQueryClient } from "@tanstack/react-query";
import { aptFetch } from "../../../api/client"; // Your fetch wrapper
import { useNavigate } from "react-router-dom";

export function useCreateProject() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (projectData: any) => {
      // This sends the exact same JSON we used in Postman
      return aptFetch('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });
    },
    onSuccess: () => {
      // 1. Refresh the "All Projects" list
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      // 2. Redirect back to the table
      navigate('/manager/projects'); 
    },
  });
} 