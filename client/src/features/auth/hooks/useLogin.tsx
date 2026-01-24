import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { User } from "../../users/types/user.types";
import { LoginResponse } from "../../auth/types/login.types";
import { aptFetch } from "../../../api/client";
import { LoginFormData } from "../schemas/login.schemas";

// 1. Define where each role should go
const ROLE_REDIRECTS: Record<string, string> = {
    // Management
    ADMIN: '/admin/users',
    PM: '/manager/projects',
    
    // The Specialist Engineers
    OPERATOR_BREAKDOWN: '/dashboard/breakdown',
    ENGINEER_JOINT:     '/dashboard/joint-drawing',
    ENGINEER_HOUSING:   '/dashboard/housing-drawing',
    ENGINEER_JIG:       '/dashboard/jig-drawing',
    ENGINEER_VISUAL:    '/dashboard/visual-drawing',
    ENGINEER_JS_ACC:    '/dashboard/job-station-acc',
    ENGINEER_JS_FIN:    '/dashboard/job-station-fin',
    
    // Default fallback
    DEFAULT: '/login' 
};

async function loginRequest(data: LoginFormData){
    return aptFetch<LoginResponse>('/auth/login',{
        method: 'POST',
        body: JSON.stringify(data),
    })
    }

export function useLogin(){
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: loginRequest,
        onSuccess: (data) => {
            // 1. Save Token & User
            localStorage.setItem("token", data.token);
            // Optional: Save user info if you want to avoid decoding token immediately
            localStorage.setItem("user", JSON.stringify(data.user));
           
            // 2. 🧠 SMART REDIRECT LOGIC
            const userRole = data.user.role; // e.g. "ENGINEER_JIG"
            
            // Look up the path, or default to home/login if role is unknown
            const targetPath = ROLE_REDIRECTS[userRole] || ROLE_REDIRECTS.DEFAULT;

            console.log(`Login success! Redirecting ${userRole} to ${targetPath}`);
            navigate(targetPath);
        },
        onError: (err: any) => {
            console.log("Hook caught error:", err.message);
        }
    });
   
    return {
        login: mutation.mutateAsync,
        isLoading: mutation.isPending,
        error: mutation.error 
    }
}

