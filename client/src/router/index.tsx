import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Login/Register";
import UsersPage from "../features/users/pages/UsersPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import AdminLayout from "../layout/AdminLayout";

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
    element: <Dashboard />
},
])
