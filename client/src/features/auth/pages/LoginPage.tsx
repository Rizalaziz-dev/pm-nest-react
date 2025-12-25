import LoginForm from "../components/LoginForm";
import { useLogin } from "../hooks/useLogin";
import { LoginFormData } from "../schemas/login.schemas";




export default function LoginPage() {
    const { login, isLoading, error } = useLogin();

    const handleLogin = async (data: LoginFormData) => {
      try {
        await login(data);
        console.log(data)

      }catch (err) {
        console.error("Login failed:", err)
      }
    };

    return (
      <div className="grid place-items-center h-screen bg-base-200">
        <LoginForm onSubmit={handleLogin} />

        {isLoading && <p className="mt-2">Logging in...</p>}
        {error && <p className="mt-2 text-red-500">{error.message}</p>}
      </div>    

    )

    
}


