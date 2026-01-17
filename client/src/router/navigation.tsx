import { LayoutDashboard, Users, Settings, Wrench, Factory } from "lucide-react"; 
import { NavItem } from '../components/ui/sidebar';
export const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
  { label: 'User Management', path: '/users', icon: <Users size={20} /> },
  { label: 'System Settings', path: '/settings', icon: <Settings size={20} /> },
];

export const OPERATOR_NAV: NavItem[] = [
  { label: 'Jig Drawing', path: '/dashboard/jig-drawing', icon: <Wrench size={20} /> },
  { label: 'Housing', path: '/dashboard/housing', icon: <Factory size={20} /> },
  { label: 'Joint', path: '/dashboard/joint', icon: <Factory size={20} /> },
  // Add other processes...
];