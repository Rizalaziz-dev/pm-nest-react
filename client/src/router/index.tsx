import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../features/auth/pages/LoginPage";
import Register from "../features/auth/pages/RegisterPage";
import UsersPage from "../features/users/pages/UsersPage";
import MainLayout from "../layout/MainLayout";
import OperatorPage from "../features/dashboard/pages/OperatorPage";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import ProjectsPage from "../features/projects/pages/ProjectsPage";
import OperatorBreakdownPage from "../features/projects/pages/OperatorBreakdownPage";
import ProjectsDetailsPage from "../features/projects/components/ProjectDetailsPage";

export const router = createBrowserRouter([
  // 1. Public Only Routes (Login / Register)
  {
    element: <PublicOnlyRoute />, // 👈 This applies the guard
    children: [
      {
        path: '/login', 
        element: <Login />
      },
      {
        path: '/register', 
        element: <Register />
      },
      // Also redirect root to login (the guard will bounce them if logged in)
      {
        path: '/',
        element: <Navigate to="/login" replace />
      },
    ]
  },
  // 2. Admin Routes
  {
    path: '/admin', 
    element: <MainLayout />, // Ensure MainLayout handles the Admin Sidebar
    children: [
        {
            path: "users",
            element: <UsersPage />,
        },
        // {
        //     path: "overview", // Added based on our previous logic
        //     element: <div>Admin Dashboard Placeholder</div> 
        // }
    ]
  },

  // 3. The Dynamic Dashboard Routes
  {
    path: '/dashboard', 
    element: <MainLayout />, 
    children: [
        // A. The "Catch-All" Route
        // This ":slug" matches ANYTHING after dashboard/
        // Examples: /dashboard/jig-drawing, /dashboard/breakdown, /dashboard/banana
        {
            path: ":slug", 
            element: <OperatorPage />,
        },
        {
            path: "breakdown", 
            element: <OperatorBreakdownPage />,
        },
        
        // B. Safety Redirect
        // If they go to just "/dashboard", send them to a safe default or back to login
        {
            path: "", 
            element: <Navigate to="/login" replace />
        }
    ]
  },


  // PM Page
  {
    path: '/manager',
    element: <MainLayout />, // Re-use the layout
    children: [
        {
            path: 'projects',
            element: <ProjectsPage />
        },
        {
            path: 'projects/:id',
            element: <ProjectsDetailsPage />
        },
        // We will build this next:
        // { path: 'projects/new', element: <CreateProjectPage /> }
    ]
}
]);