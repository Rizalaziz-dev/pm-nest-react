import { useForm } from "react-hook-form";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { RegisterFormData, registerScheme } from "../../auth/schemas/register.schemas";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
    onSubmit: (users: RegisterFormData) => void
}

export default function CreateForm({onSubmit}: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        } = useForm<RegisterFormData>({
        resolver: zodResolver(registerScheme),
        });
    return (
        <>
        <form 
        id="create-user-form" 
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-2">
            <h3 className="text-lg font-bold">Create User</h3>
            <Input
            label="Full Name"
            type="text"
            {...register("name")}
            error={errors.name?.message}
            />
            <Input
            label="Email"
            type="email"
            {...register("email")}
            error={errors.email?.message}
            />
            {/* <Input
            label="Role"
            type="text"
            {...register("role")}
            error={errors.role?.message}
            /> */}
            <fieldset className="fieldset w-full px-0">
                <legend className="fieldset-legend text-base-content">
                    User Role
                </legend>
                <select 
                    className={`select select-bordered w-full ${errors.role ? 'select-error' : ''}`}
                    {...register("role")}
                    defaultValue="" // Important: Set a default empty value
                    >
                    <option value="" disabled>Pick a role</option>
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                </select>
                {errors.role && (
                    <label className="label">
                        <span className="label-text-alt text-error">{errors.role.message}</span>
                    </label>
                )}
            </fieldset>
            <Input
            label="Password"
            type="password"
            {...register("password")}
            error={errors.password?.message}
            />
            <Input
            label="Confirm Password"
            type="password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
            />                               
        </form>   
        </>
    );
}