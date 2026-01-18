import React, { useMemo, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from '../components/ui/sidebar';
import { useAuth } from '../features/auth/hooks/useAuth'; 
import { MENU_ITEMS, getMyWorkspace } from '../config/navigation';

export const MainLayout: React.FC = () => {
  // 1. ALL HOOKS MUST BE AT THE TOP
  const { user, loading } = useAuth(); 
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // 2. DEFINE USEMEMO (Safe against null user)
  // We run this hook unconditionally, but handle null user inside
  const navLinks = useMemo(() => {
    // Safety: If no user yet, return empty list
    if (!user) return [];

    const links = [];

    // A. Add "My Workspace"
    const workspace = getMyWorkspace(user.role);
    if (workspace) {
      links.push(workspace);
    }

    // B. Add Standard Menu Items
    MENU_ITEMS.forEach((item) => {
      if (item.allowedRoles.includes(user.role)) {
        links.push({
            label: item.label,
            path: item.path,
            icon: item.icon
        });
      }
    });

    return links;
  }, [user]); // Re-run only when user changes

  // 3. NOW YOU CAN DO CONDITIONAL RETURNS
  if (loading) {
     return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
     return <Navigate to="/login" replace />;
  }

  // 4. RENDER
  return (
    <div className="flex min-h-screen bg-base-200 transition-all duration-300">
      
      <Sidebar 
        links={navLinks} 
        // We can safely access user here because of the 'if (!user)' check above
        userRole={user.role.replace(/_/g, " ")} 
        userName={user.name} 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <main 
        className={`flex-1 p-8 fade-in transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;