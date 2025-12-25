import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser } from "../../../api/users.api";


export function useRegister() {
    const queryClient = useQueryClient();

    const registerUserMutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['users']
            });
        }
    })

    return {
        registerUser: registerUserMutation.mutate,
        isLoading: registerUserMutation.isPending,
        error: registerUserMutation.error as Error | null
    }
}