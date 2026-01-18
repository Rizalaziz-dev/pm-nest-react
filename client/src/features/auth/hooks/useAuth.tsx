import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface UserPayload {
  id: string;
  name: string;
  role: string;
  email?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get the token
    const token = localStorage.getItem('token');

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // 2. Decode it (Same logic as your MainLayout)
      const decoded: any = jwtDecode(token);
      
      setUser({
        id: decoded.sub,   // 'sub' is standard for ID in JWT
        role: decoded.role,
        name: decoded.name || decoded.username || 'User',
        email: decoded.email
      });
    } catch (error) {
      console.error("Failed to decode token", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading };
};