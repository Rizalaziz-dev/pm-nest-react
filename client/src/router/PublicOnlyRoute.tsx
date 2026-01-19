import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { getHomePath } from '../config/navigation';

export const PublicOnlyRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a spinner

  if (user) {
    // 🛑 User is already logged in! Block them from Login page.
    const target = getHomePath(user.role);
    return <Navigate to={target} replace />;
  }

  // ✅ User is not logged in. Let them pass.
  return <Outlet />;
};