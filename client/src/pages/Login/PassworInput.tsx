import { useFormContext } from "react-hook-form";
import Input from "../../components/ui/Input";
import { LoginFormData } from "../../schemas/login.schemas";

export function PasswordInput() {
    const {
        register,
        formState: {errors},
    } = useFormContext<LoginFormData>();
    

    return( 
        <Input
        label="Password"
        type="password"
        {...register("password")}
        error={errors.password?.message}
        />
    );
}