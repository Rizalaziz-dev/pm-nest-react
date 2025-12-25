import RegisterForm from "../components/RegisterForm";
import { useRegister } from "../hooks/useRegister"






export default function Register() {
const { isLoading, registerUser } = useRegister();
    
    if (isLoading) return 'Loading...'

    return (
        <RegisterForm
        onSubmit={registerUser}
        
        />
        
    );
}