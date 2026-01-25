// Login Page works to talk to the server and handle business logic (is the user allowed in?)
// Smart(Container)

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";


import LoginForm from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";
import { LoginFormData, loginScheme } from "../schemas/login.schemas";
import { ROLE_DEFAULT_PATH } from "../../../config/navigation";

export default function LoginPage() {
  const navigate = useNavigate();

  // Api call hook
  const { login, isLoading, error } = useLogin();
  
  // FORM Manager
  const methods = useForm<LoginFormData>({
  resolver: zodResolver(loginScheme),
  });
  
  // Handler
  const handleLogin = async (data: LoginFormData) => {
    try {
      // Call the api
      const response = await login(data);

      // Store the Token
     localStorage.setItem('token', response.token);

     // Get The Role from the token
     const userRole = response.user.role;
     const userName = response.user.name;

     toast.success(`Welcome back, ${userName}!`);

     const redirectPath = ROLE_DEFAULT_PATH[userRole] || '/manager/projects'; // The || is a fallback safety net
      navigate(redirectPath);

     // Redirect based on role
    //  if (userRole === 'ADMIN') {
    //         navigate('/admin/users');
    //     } else if(userRole === 'PM') {
    //         navigate('/manager/projects');
    //     } else {
    //         // Default operator view
    //         navigate('/manager/projects');
    //     }

    // catch the error from ./api/client/ts
    }catch (err:any) {
      console.error("Login Logic Error:", err);
      const errorMessage = err?.message || "An unknown error occurred";

      if (errorMessage.toLowerCase().includes('email')) {
        methods.setError('email', { type: 'manual', message: errorMessage });
      } else if (errorMessage.toLowerCase().includes('password')) {
        methods.setError('password', { type: 'manual', message: errorMessage });
      } else {
        toast.error(errorMessage);
      }
    }
  };

    return (
      <div className="grid place-items-center h-screen bg-base-200">
      <div className="w-full max-w-md"> {/* Added wrapper for layout stability */}
        
        <LoginForm 
          onSubmit={handleLogin} 
          methods={methods}
        />

        {/* FIX: Comments in JSX must be inside braces like this */}
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center mt-4">
             <span className="loading loading-spinner text-primary"></span>
          </div>
        )}

        
      </div>
    </div>    
  );
}


