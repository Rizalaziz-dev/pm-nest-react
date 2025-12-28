import { User } from "../features/users/types/user.types";
import { aptFetch } from "./client";

export type CreateUserDTO = Omit<User, 'id'>;

export const createUser = (newUser: CreateUserDTO) => {
    return aptFetch<User>('/users/user', {
        method: 'POST',
        body: JSON.stringify(newUser),
    })
}

export const getUsers = () => {
    return aptFetch<User[]>('/users');
}

export const updateUser = (user: User) => {
    return aptFetch<User>(`/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(user),
    });
}

export const deleteUser = (id: string) => {
    return aptFetch<void>(`/users/${id}`, {
        method: 'DELETE',
    });
}

