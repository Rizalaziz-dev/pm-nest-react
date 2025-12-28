import { useRef, useState } from "react";
import { useRegister } from "../../auth/hooks/useRegister";
import CreateForm from "../components/CreateForm";
import { UsersTable } from "../components/UsersTable";
import { useUser } from "../hooks/useUser";
import { toast } from 'react-hot-toast'
import { RegisterFormData, UserEntity } from "../../auth/schemas/register.schemas";

export default function UsersPage() {
    const [selectedUser, setSelectedUser] = useState<UserEntity | null>(null);
    const { data, isPending, updateUser, deleteUser } = useUser();
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
        <div>
            <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-sm">
                    <CreateForm
                    key={selectedUser?.id || 'new'}
                    onSubmit={handleCreateSubmit}
                    initialData={selectedUser}/>
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
            <button 
            className="btn btn-primary"
            onClick={openCreateModal}>
                Add New User
            </button>
            <UsersTable 
            users={data}
            onEdit={openEditModal} 
            onDelete={handleDelete}
            />
        </div>
    )
}