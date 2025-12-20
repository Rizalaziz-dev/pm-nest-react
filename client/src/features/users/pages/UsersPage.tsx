import { UsersTable } from "../components/UsersTable";
import { useUser } from "../hooks/useUser";


export default function UsersPage() {
    const { data, isPending, editUser, deleteUser, createUser } = useUser();

    if (isPending) return 'Loading...'

    if (!data) return 'No data available';

    // const handleCreate = () => {
    //     createUser({
    //         name: 'New User',
    //         email: 'newuser@example.com',
    //         password: 'password123',
    //     })
    // }

    return (
        
        <UsersTable 
        users={data}
        onEdit={editUser} 
        onDelete={deleteUser} 
        />
    )
}