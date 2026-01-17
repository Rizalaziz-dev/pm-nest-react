import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export interface NavItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  links: NavItem[];
  userRole: string;
  userName: string;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ links, userRole, userName, isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Dynamic width based on collapse state
  const widthClass = isCollapsed ? 'w-20' : 'w-64';

  return (
    <aside 
      className={`${widthClass} bg-base-100 h-screen border-r border-base-200 flex flex-col fixed left-0 top-0 z-20 shadow-lg transition-all duration-300 ease-in-out`}
    >
      
      {/* 1. HEADER + TOGGLE BUTTON */}
      <div className={`h-16 flex items-center border-b border-base-200 bg-base-100 ${isCollapsed ? 'justify-center' : 'justify-between px-6'}`}>
        
        {/* Logo (Hide text if collapsed) */}
     {!isCollapsed && (
             <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
                
                {/* The Logo: A stylized Scheduler/Calendar Icon */}
                <div className="w-10 h-10 flex items-center justify-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                        {/* A little "Check" mark inside to show progress */}
                        <path d="M8 15h2l4 4"></path> 
                    </svg>
                </div>

                {/* The Text Hierarchy */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-xl font-black tracking-tight text-base-content leading-tight">
                        SCHEDULE
                    </h1>
                    <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-widest">
                        Production Drawing
                    </p>
                </div>
            </div>
        )}

        
        
        {/* THE SANDWICH BUTTON */}
        <button onClick={toggleSidebar} className="btn btn-ghost btn-sm btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
      </div>

      {/* 2. NAVIGATION LINKS */}
      <div className="flex-1 overflow-y-auto py-6">
        <ul className="menu w-full px-2 gap-2">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink 
                to={link.path}
                className={({ isActive }) => 
                  `flex items-center gap-4 p-2 rounded-lg transition-colors
                  ${isActive ? "bg-primary text-primary-content font-semibold" : "text-base-content/70 hover:bg-base-200"}
                  ${isCollapsed ? "justify-center" : ""}`
                }
                title={isCollapsed ? link.label : ""} // Tooltip when collapsed
              >
                {/* Icon Wrapper */}
                <span className="flex-shrink-0">{link.icon}</span>
                
                {/* Text Label (Hidden if collapsed) */}
                {!isCollapsed && <span className="whitespace-nowrap">{link.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* 3. USER PROFILE (Footer) */}
      <div className="p-4 border-t border-base-200 bg-base-200/30">
        {!isCollapsed ? (
             // Full View
            <>
                <div className="flex items-center gap-3 mb-4">
                    <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-10">
                        <span className="text-xs">{userName.substring(0,2).toUpperCase()}</span>
                    </div>
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold truncate">{userName}</p>
                        <p className="text-xs opacity-50 badge badge-ghost badge-sm">{userRole}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="btn btn-outline btn-error btn-sm w-full gap-2">
                    Log Out
                </button>
            </>
        ) : (
            // Collapsed View (Just Avatar)
            <div className="flex flex-col items-center gap-4">
                 <div className="avatar placeholder cursor-help" title={userName}>
                    <div className="bg-neutral text-neutral-content rounded-full w-8">
                        <span className="text-xs">{userName.substring(0,1).toUpperCase()}</span>
                    </div>
                </div>
                <button onClick={handleLogout} className="btn btn-ghost btn-xs text-error" title="Log Out">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </button>
            </div>
        )}
      </div>
    </aside>
  );
};