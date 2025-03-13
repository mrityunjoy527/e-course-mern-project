import { Link, useLocation } from 'react-router-dom';
import { TbBooks } from "react-icons/tb";
import { BiBarChartSquare } from "react-icons/bi";
import { useEffect, useState } from 'react';


function Sidebar() {

    const loc = useLocation();
    const [toggle, setToggle] = useState(loc.pathname === "/admin");
    useEffect(() => {
        setToggle(loc.pathname === "/admin");
    }, [loc.pathname]);

    return (
        <div className="h-[calc(100vh-60px)] w-[25%] bg-[#f0f0f0f0] flex-col gap-4 px-6 py-10 lg:p-10 hidden md:flex">
            <Link to="/admin" className='text-lg font-semibold flex items-center gap-2'>
                <BiBarChartSquare className={`w-8 h-8 ${toggle ? "text-blue-600" : ""}`} />
                <p className={`text-xl ${toggle ? "text-blue-600" : ""}`}>Dashboard</p>
            </Link>
            <Link to="/admin/course" className='text-lg font-semibold flex items-center gap-2'>
                <TbBooks className={`w-8 h-8 ${!toggle ? "text-blue-600" : ""}`} />
                <p className={`text-xl ${!toggle ? "text-blue-600" : ""}`}>Courses</p>
            </Link>
        </div>
    )
}

export default Sidebar;