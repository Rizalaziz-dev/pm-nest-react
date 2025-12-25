import { useFormContext } from "react-hook-form";
import Input from "../../../components/ui/Input";
import { LoginFormData } from "../schemas/login.schemas";

export function EmailInput() {
    const {
        register,
        formState: {errors},
    } = useFormContext<LoginFormData>();
    

    return( 
        <Input
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
        />
    );
}