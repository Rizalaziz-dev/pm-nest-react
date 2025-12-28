import { useRef } from "react";
import { useRegister } from "../../auth/hooks/useRegister";
import CreateForm from "../components/CreateForm";
import { UsersTable } from "../components/UsersTable";
import { useUser } from "../hooks/useUser";
import { toast } from 'react-hot-toast'


export default function UsersPage() {
    const { data, isPending, editUser, deleteUser, createUser } = useUser();
    const { isLoading, registerUser } = useRegister();
    // the Ref (specifically for a HTMLDialogElement)
    const modalRef=useRef<HTMLDialogElement>(null);

    const handleCreateSubmit = async (formData: any) => {
        const loadingToast = toast.loading('Creating user...')
        try {
            await registerUser(formData, {
                onSuccess: () => {
                    toast.success('User created succesgully',{id: loadingToast} )
                    modalRef.current?.close();
                }
            });
        } catch (error: any) {
            toast.error(error.message || 'Failed to create user', { id: loadingToast });
            console.error("Mutation failed", error);
        }
    }

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
        <div>
            <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-sm">
                    <CreateForm
                    onSubmit={handleCreateSubmit}/>
                <div className="modal-action">
                    <button
                    className="btn btn-ghost btn-primary"
                    type="submit"
                    form="create-user-form"
                    disabled={isLoading}
                    >
                        {isLoading && <span className="loading loading-spinner"></span>}
                    Register</button>
                    <form method="dialog">
                        <button 
                        className="btn btn-ghost"
                        >Close</button>
                    </form>
                </div>

                </div>

            </dialog>
            <button 
            className="btn btn-primary"
            onClick={()=> modalRef.current?.showModal()}>
                Add New User
            </button>
            <UsersTable 
            users={data}
            onEdit={editUser} 
            onDelete={deleteUser} 
            />
        </div>
    )
}