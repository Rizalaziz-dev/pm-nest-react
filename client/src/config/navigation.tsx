import React from 'react';

// Define the shape of a navigation item
export interface NavItemConfig {
  label: string;
  path: string;
  icon: React.ReactNode;
  allowedRoles: string[]; // Who can see this?
}

// 1. THE STATIC MENU ITEMS
export const MENU_ITEMS: NavItemConfig[] = [
  // --- ADMIN ONLY ---
  { 
    label: "Manage Users", 
    path: "/admin/users", 
    allowedRoles: ["ADMIN"],
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
  },
  { 
    label: "System Overview", 
    path: "/admin/overview", 
    allowedRoles: ["ADMIN", "MANAGER"],
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
  },

  // --- MANAGER / LEAD ---
  { 
    label: "All Projects", 
    path: "/manager/projects", 
    allowedRoles: ["PM"],
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
  },
];

// 2. DYNAMIC WORKSPACE GENERATOR
// Takes a role (e.g., 'ENGINEER_JIG') and returns their specific work queue link
export const getMyWorkspace = (role: string) => {
  const PROCESS_MAP: Record<string, string> = {
    'OPERATOR_BREAKDOWN': 'breakdown',
    'ENGINEER_JOINT':     'joint-drawing',
    'ENGINEER_HOUSING':   'housing-drawing',
    'ENGINEER_JIG':       'jig-drawing',
    'ENGINEER_VISUAL':    'visual-drawing',
    'ENGINEER_JS_ACC':    'job-station-acc',
    'ENGINEER_JS_FIN':    'job-station-fin',
  };

  const slug = PROCESS_MAP[role];
  
  if (!slug) return null;

  return {
    label: "My Workspace",
    path: `/dashboard/${slug}`,
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></svg>
  };
};

export const ROLE_DEFAULT_PATH: Record<string, string> = {
  'ADMIN':              '/admin/users',
  'MANAGER':            '/admin/overview',
  'PM':                 '/manager/projects',
  'OPERATOR_BREAKDOWN': '/dashboard/breakdown',
  'ENGINEER_JOINT':     '/dashboard/joint-drawing',
  'ENGINEER_HOUSING':   '/dashboard/housing-drawing',
  'ENGINEER_JIG':       '/dashboard/jig-drawing',
  'ENGINEER_VISUAL':    '/dashboard/visual-drawing',
  'ENGINEER_JS_ACC':    '/dashboard/job-station-acc',
  'ENGINEER_JS_FIN':    '/dashboard/job-station-fin',
};

export const getHomePath = (role: string) => {
  return ROLE_DEFAULT_PATH[role] || '/login';
};