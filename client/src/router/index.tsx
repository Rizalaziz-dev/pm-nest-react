import { createBrowserRouter } from "react-router-dom";
import Login from "../features/auth/pages/LoginPage";
import Register from "../features/auth/pages/RegisterPage";
import UsersPage from "../features/users/pages/UsersPage";
import MainLayout from "../layout/MainLayout";
import OperatorPage from "../features/dashboard/pages/OperatorPage";


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
    element: <MainLayout />,
    children: [
        {
            path: "users",
            element: <UsersPage />,
        }
    ]
    },
    {
    path: '/dashboard', 
    element: <MainLayout />,
    children: [
        {
            path: "operator",
            element: <OperatorPage />,
        }
    ]
    },
    
  ])
