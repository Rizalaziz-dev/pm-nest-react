import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerScheme, RegisterFormData } from "../../schemas/register.schemas";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { Link } from "react-router";

export default function Register() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerScheme),
    });
    
    const onSubmit = (data: RegisterFormData) => {
        console.log("Form Data:", data);
    };

    return (
        <div className="grid place-items-center h-screen">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <div className="flex justify-start items-center-safe">
                        <Link to={"/login"}>                        
                            <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-10 w-10 mr-2 mb-2 hover:text-gray-600 cursor-pointer" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="40"
                            viewBox="0 0 640 640">
                            <path 
                            d="M201.4 297.4C188.9 309.9 188.9 330.2 201.4 342.7L361.4 502.7C373.9 515.2 394.2 515.2 406.7 502.7C419.2 490.2 419.2 469.9 406.7 457.4L269.3 320L406.6 182.6C419.1 170.1 419.1 149.8 406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3L201.3 297.3z"/>
                            </svg>
                        </Link>
               
                    <h2 className="text-3xl font-bold mb-2">Register</h2>
                    </div>
                    <Input
                        label="First Name"
                        type="text"
                        {...register("firstName")}
                        error={errors.firstName?.message}
                        />
                        <Input
                        label="Last Name"
                        type="text"
                        {...register("lastName")}
                        error={errors.lastName?.message}
                        />
                        <Input
                        label="Email"
                        type="email"
                        {...register("email")}
                        error={errors.email?.message}
                        />
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

                    <Button text="Register" type="submit"/>
                                
                </Card>
            </form>
        </div>
    );
}