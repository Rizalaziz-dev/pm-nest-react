import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, CreateUserDTO, deleteUser, getUsers, updateUser } from "../../../api/users.api";



export function useUser() {
    const queryClient = useQueryClient();

    const usersQuery = useQuery ({
        queryKey: ['users'],
        queryFn: getUsers,
    })

    const createUserMutation = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    })

    const updateUserMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    })

    const deleteUserMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    })


    return {
        ...usersQuery,
        createUser: createUserMutation.mutate,
        updateUser: updateUserMutation.mutate,
        deleteUser: deleteUserMutation.mutate,
    }

}
