import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dashboardApi } from "../../../api/dashboard.api";
import { toast } from "react-hot-toast";

export function useSmartQueue(processName: string) {
    const queryClient = useQueryClient();

    // 1. THE QUERY (Get the list)
    const queueQuery = useQuery({
        queryKey: ['smart-queue', processName],
        queryFn: () => dashboardApi.getPool(processName),
        // Optional: Keep data fresh for 1 min, auto-refetch every 5 mins
        staleTime: 1000 * 60,
        refetchInterval: 1000 * 60 * 5, 
    });

    // 2. THE MUTATION (Pull the job)
    const pullJobMutation = useMutation({
        mutationFn: ({ workOrderId, userId }: { workOrderId: string; userId: string }) => 
            dashboardApi.startJob(workOrderId, userId),
        onSuccess: () => {
            toast.success("Job Pulled! Good luck.");
            // Refresh the list immediately
            queryClient.invalidateQueries({ queryKey: ['smart-queue'] });
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to pull job. It might be locked.");
        }
    });

    // 3. RETURN EVERYTHING (Spread syntax)
    return {
        ...queueQuery, // returns data, isLoading, isError, etc.
        pullJob: pullJobMutation.mutate,
        isPulling: pullJobMutation.isPending, // Separate loading state for the button
    };
}