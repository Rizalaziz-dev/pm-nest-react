import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Import your Sidebar and Navigation Arrays
import { Sidebar } from '../components/ui/sidebar';
import { ADMIN_NAV, OPERATOR_NAV } from '../router/navigation';

export const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'ADMIN' | 'OPERATOR' | null>(null);
  const [userName, setUserName] = useState<string>('');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check for Token
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // 2. Decode Token
      const decoded: any = jwtDecode(token);    
      
      // Set Role and UserName
      setRole(decoded.role || 'OPERATOR');
      const nameFromToken = decoded.name || decoded.username || decoded.email || 'User';
      setUserName(nameFromToken);
    } catch (e) {
      console.error("Invalid Token");
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  // Prevent flashing empty screen while checking
  if (!role) return null; 

  // 3. Select the correct Menu
  const navLinks = role === 'ADMIN' ? ADMIN_NAV : OPERATOR_NAV;

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* 4. Pass the Data to Sidebar */}
      <Sidebar 
        links={navLinks} 
        userRole={role} 
        userName={userName} 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 fade-in">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;