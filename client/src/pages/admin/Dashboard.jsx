import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Dashboard() {
  return (
    <div className="h-[calc(100vh-60px)] flex w-full mt-[60px] overflow-hidden ">
      <Sidebar />
      <div className='lg:px-20 md:px-10 py-10 px-3 w-full overflow-y-auto'>
        <Outlet />
      </div>
    </div>
  )
}

export default Dashboard;