import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export function useLogout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const logout = () => {
        // 1. Clear the Token
        localStorage.removeItem("token");

        // 2. Clear the TanStack Query Cache
        // This is CRITICAL: it prevents the next user from seeing 
        // the previous user's data in the cache.
        queryClient.clear();

        // 3. Send them home
        navigate("/login");
    };

    return { logout };
}