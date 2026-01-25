import { useRef, useState } from "react";
import { useRegister } from "../../auth/hooks/useRegister";
import CreateForm from "../components/CreateForm";
import { UsersTable } from "../components/UsersTable";
import { useUsers } from "../hooks/useUsers";
import { toast } from 'react-hot-toast'
import { RegisterFormData, UserEntity } from "../../auth/schemas/register.schemas";

export default function UsersPage() {
    const [selectedUser, setSelectedUser] = useState<UserEntity | null>(null);
    const { data, isPending, updateUser, deleteUser } = useUsers();
    const { isLoading, registerUser } = useRegister();
    // the Ref (specifically for a HTMLDialogElement)
    const modalRef=useRef<HTMLDialogElement>(null);

    const openCreateModal = () => {
        setSelectedUser(null); // Clear data
        modalRef.current?.showModal();
    };

    const openEditModal = (user: UserEntity) => {
        setSelectedUser(user); // Fill data
        modalRef.current?.showModal();
    }

    const handleCreateSubmit = async (formData: RegisterFormData) => {
        const loadingToast = toast.loading(selectedUser ? "Updating..." : "Creating...");
        if (selectedUser) {
            console.log("Updating user:", selectedUser.id);
            // We take the ID from the state, and the data from the form
            await updateUser({ id: selectedUser.id, ...formData }, {
            onSuccess: () => {
                toast.success("User updated!", { id: loadingToast });
                modalRef.current?.close();
                setSelectedUser(null);
            },
            onError: (err: any) => {
                toast.error(err.message || "Update failed", { id: loadingToast });
            }
        });
        } else {
            registerUser(formData, {
                onSuccess: () => {
                    toast.success('User created succesfully',{id: loadingToast} )
                    modalRef.current?.close();
                    setSelectedUser(null);
                },
                onError: (err: any) => {
                toast.error(err.message || "Creation failed", { id: loadingToast });
            }
            });                  
        }
    }
    

    const handleDelete = async(data: any) => {
        try {
            deleteUser(data, {
                onSuccess: () => {
                    toast.success('User has been deleted');
                }
            });
        } catch (error) {
            console.error("Cannot Delete :",error)
        }
    }
 

    if (isPending) return 'Loading...'

    if (!data) return 'No data available';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
            <div>
            <h1 className="text-2xl font-bold">Active Users</h1>
            <p className="text-sm opacity-60">Manage users.</p>
            </div>
            <button 
                    className="btn btn-primary"
                    onClick={openCreateModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        New User
                    </button>
            </div>
            <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-sm">
                    <CreateForm
                    key={selectedUser?.id || 'new'}
                    onSubmit={handleCreateSubmit}
                    initialData={selectedUser ? {
                    name: selectedUser.name,
                    email: selectedUser.email,
                    role: selectedUser.role,
                    password: selectedUser.password,      
                    confirmPassword: selectedUser.password 
                } : undefined}/>
                <div className="modal-action">
                    <button
                    className="btn btn-ghost btn-primary"
                    type="submit"
                    form="create-user-form"
                    disabled={isLoading}
                    >
                        {isLoading && <span className="loading loading-spinner"></span>}
                        {selectedUser ? "Update" : "Register"}</button>
                    <form method="dialog">
                        <button 
                        type="button" 
                        className="btn btn-ghost" 
                        onClick={() => modalRef.current?.close()}>
                        Cancel</button>
                    </form>
                </div>

                </div>

            </dialog>
            
            <UsersTable 
            users={data}
            onEdit={openEditModal} 
            onDelete={handleDelete}
            />
        </div>
    )
}