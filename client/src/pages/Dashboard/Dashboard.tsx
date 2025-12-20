import {
  QueryClient,
  QueryClientProvider,
  useQuery
} from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function Dashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  )
}
//     <div className="grid place-items-center h-screen">
//         <h1>Welcome</h1>
//     </div>
//   )
// }
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

function DashboardContent() {
  const { 
  isPending,
  error,
  data } = useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: async (): Promise<User[]> => {
      const res = await fetch('http://localhost:3000/users');

    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    
    return res.json();
      // fetch('http://localhost:3000/users/4').then(res => res.json())
    }
    })


    if (isPending) return 'Loading...'

    if (error) return 'An error has occured: ' + error.message

    return (
      <div className="overflow-x-auto">
        <table className="table table-xs" style={{width: '100%'}}>
          <thead>
            <tr>
              <th style={{width: '10%'}}>ID</th>
              <th style={{width: '25%'}}>Name</th>
              <th style={{width: '30%'}}>Email</th>
              <th style={{width: '20%'}}>Password</th>
              <th style={{width: '15%'}}>Action</th>
            </tr>
          </thead>
          
          <tbody>
            {data?.map((user) => ( 
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.password}</td>
                <td>
                <button className="btn btn-xs btn-primary">Edit</button>
                <button className="btn btn-xs btn-danger ml-2">Delete</button>  
                </td>             
              </tr>
            ))}                      
          </tbody>
        </table>
      </div>
      ) 
    }
      
    