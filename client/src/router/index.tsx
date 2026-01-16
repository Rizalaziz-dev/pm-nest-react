import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/LoginPage";
import Register from "../features/auth/pages/RegisterPage";
import UsersPage from "../features/users/pages/UsersPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import AdminLayout from "../layout/AdminLayout";
import OperatorLayout from "../layout/OperatorLayout";
import OperatorPage from "../pages/Dashboard/OperatorPage";

export const router = createBrowserRouter([
  {
    path: '/login', 
    element: <Login />
    },
  {
    path: '/register', 
    element: <Register />
    },
  {
    path: '/admin', 
    element: <AdminLayout />,
    children: [
        {
            path: "users",
            element: <UsersPage />,
        }
    ]
    },
    {
    path: '/dashboard', 
    element: <OperatorLayout />,
    children: [
        {
            path: "operator",
            element: <OperatorPage />,
        }
    ]
    },
    
  ])
