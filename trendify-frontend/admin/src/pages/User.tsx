import { Card } from '@/components/ui/card'
import UserTable from '@/components/UserTable';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useEffect, useState } from 'react'

const User = () => {
  const [users, setUsers] = useState([]);
  const {Backend_API} = useAuth();
  const getAllUsers = async () => {
    const response = await axios.get(`${Backend_API}/api/user`);
    setUsers(response.data.users);
  }
  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <>
      <Card>
        <div className='p-6'>
          <div className='flex justify-end'>
            {/* <UserDialog refreshData={getAllUsers} /> */}
          </div>
          <UserTable data={users} refreshData={getAllUsers} />
        </div>
      </Card> 
    </>
  )
}

export default User
