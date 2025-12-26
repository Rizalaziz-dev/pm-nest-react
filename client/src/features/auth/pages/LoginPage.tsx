// Login Page works to talk to the server and handle business logic (is the user allowed in?)
// Smart(Container)

import { useForm } from "react-hook-form";
import LoginForm from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";
import { LoginFormData, loginScheme } from "../schemas/login.schemas";
import { zodResolver } from "@hookform/resolvers/zod";

export default function LoginPage() {
    const { login, isLoading, error } = useLogin();
   
    const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginScheme),
    });

    const handleLogin = async (data: LoginFormData) => {
      try {
        await login(data);

      // catch the error from ./api/client/ts
      }catch (err:any) {
        if (err.message.includes('email') || err.message.includes('email')) {
          methods.setError('email', {
            type: 'manual',
            message: err.message
          });
        }else if (err.message.includes('password')){
          methods.setError('password', {
            type: 'manual',
            message: err.message
          });
        }
      }
    };

    return (
      <div className="grid place-items-center h-screen bg-base-200">
        <LoginForm 
        onSubmit={handleLogin} 
        methods={methods}
        />

        // This code where the error appear 

        {isLoading && <p className="mt-2">Logging in...</p>}

        {error && (
                <p className="text-sm text-red-500 font-semibold animate-pulse">
                    {(error as any).message || "An unknown error occurred"}
                </p>
            )}
      
      </div>    
    )    
}


