import { StrictMode } from 'react'
import ReactDOM  from 'react-dom/client'
import { RouterProvider} from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


import './index.css'
import { router } from './router'



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
