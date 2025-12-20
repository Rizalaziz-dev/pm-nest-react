import { StrictMode } from 'react'
import ReactDOM  from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


import './index.css'
import Login from './pages/Login/Login'
import Register from './pages/Login/Register'
import UsersPage from './features/users/pages/UsersPage'
import Dashboard from './pages/Dashboard/Dashboard'

const router = createBrowserRouter([
  {path: '/login', element: <Login/>},
  {path: '/register', element: <Register/>},
  {path: '/users', element: <UsersPage/>},
  {path: '/dashboard', element: <Dashboard/>},
])

const queryClient = new QueryClient({
defaultOptions: {
  queries: {
    refetchOnWindowFocus: false,
    retry: 1,
  }
}
})
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error ('Root Element Not Found')
}

ReactDOM.createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
