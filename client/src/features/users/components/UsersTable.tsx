import { User } from "../types/user.types"


interface Props {
    users: User[]
    onEdit: (user: User) => void
    onDelete: (id: number) => void
    // onCreate: (users: CreatUserDto) => void
}

export function UsersTable({ users, onEdit, onDelete }: Props) {
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
            {users?.map((user) => ( 
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
    )}