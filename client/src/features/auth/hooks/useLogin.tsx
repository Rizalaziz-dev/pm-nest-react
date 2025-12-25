import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { User } from "../../users/types/user.types";
import { LoginResponse } from "../../auth/types/login.types";
import { aptFetch } from "../../../api/client";
import { LoginFormData } from "../schemas/login.schemas";


async function loginRequest(data: LoginFormData){
    return aptFetch<LoginResponse>('/auth/login',{
        method: 'POST',
        body: JSON.stringify(data),
    })
    }
//     const response = await fetch("", {
//         method: "POST",
//         headers: {
//             "Content-Type" : "application/json",
//         },
//         body: JSON.stringify(data)
//     });

//     if (!response.ok) {
//         throw new Error("User Not Found")
//     }

//     return response.json();
// }

export function useLogin(){
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: loginRequest,
        onSuccess: (data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/admin/users")
        }
    });

    return {
        login: mutation.mutateAsync,
        isLoading: mutation.isPending,
        error: mutation.error as Error | null
    }
}

