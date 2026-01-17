import { jwtDecode } from "jwt-decode";

interface JWTPayload {
    sub: string;      // The User ID
    username: string; // The Username
    exp: number;      // Expiration time
}

export const getMyUserId = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode<JWTPayload>(token);
        return decoded.sub; // This returns "cm5z9q..."
    } catch (error) {
        console.error("Invalid Token", error);
        return null;
    }
};