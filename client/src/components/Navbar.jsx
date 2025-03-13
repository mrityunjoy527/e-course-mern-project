import { useEffect, } from "react";
import { FiLogOut } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import ProfileDialog from "./ProfileDialog";
import { LuSchool } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../utils/useAuth";
import { useMutation } from "react-query";
import { toast } from "react-hot-toast";
import useProfileDialog from "../utils/useProfileDialog";

function Navbar() {

    const { openProfileDialog, openThemeDialog, toggleProfileDialog, toggleThemeDialog } = useProfileDialog();
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const { mutateAsync: logout, isLoading, isSuccess, data } = useMutation({
        mutationFn: logoutUser
    });

    async function onLogout() {
        await logout();
    }

    useEffect(() => {
        if (isLoading) {
            toast.loading("Logging out...", { id: 5 });
        }
        if (isSuccess) {
            if (!data?.isLoggedOut) toast.error(data?.message, { id: 5 });
            else {
                navigate("/login", { replace: true });
                toast.success(data?.message, { id: 5 });
            }
        }
    }, [isSuccess, isLoading]);

    return (
        <div className="w-screen fixed left-0 top-0 bg-white z-40 px-3 border-b-2 border-gray-100">
            <div className="flex max-w-screen-xl items-center mx-auto justify-between h-[60px]">
                <Link to="/" className="flex items-center gap-3">
                    <LuSchool className="h-8 w-8 hidden sm:block" />
                    <h1 className="font-extrabold text-2xl">SkillSprint</h1>
                </Link>
                <div className="flex items-center gap-3 sm:relative">
                    <IoMenu className="sm:hidden block h-9 w-9 cursor-pointer" onClick={(e) => {
                        toggleProfileDialog();
                        e.stopPropagation();
                    }} />
                    <div className={`sm:hidden absolute top-0 right-0 flex items-center h-screen w-screen ${!openProfileDialog ? "hidden" : ""}`}>
                        <div className="h-full w-[30%] bg-black opacity-70" >
                        </div>
                        <ProfileDialog show={openProfileDialog} className="absolute right-0 h-full top-0 w-[70%] border rounded-l-xl p-2 bg-white" >
                            <header className="w-full flex items-center justify-end p-2" >
                                <RxCross2 className="h-9 w-9 text-end cursor-pointer" onClick={(e) => {
                                    toggleProfileDialog();
                                    e.stopPropagation();
                                }} />
                            </header>
                            <div className="flex items-center justify-between p-2 sm:hidden">
                                <img className="h-8 w-8" src="/school.png" alt="" />
                                <button className="hover:bg-gray-100 transition-all duration-150 p-2 rounded-md cursor-pointer border relative">
                                    <img className="h-5 w-5" src="/sun.png" alt="" />
                                </button>
                            </div>
                            <li className="p-2 text-lg font-bold"><a>My Account</a></li>
                            <hr className="my-1" />
                            <li className="flex text-base cursor-pointer hover:bg-gray-100 rounded" onClick={toggleProfileDialog} >
                                <Link to="/my-learning" className="w-full p-2">My Learning</Link>
                            </li>
                            <li className="flex text-base cursor-pointer hover:bg-gray-100 rounded" onClick={toggleProfileDialog}>
                                <Link to="/profile" className="w-full p-2">Profile</Link>
                            </li>
                            <li className="p-2 text-base cursor-pointer hover:bg-gray-100 rounded" onClick={() => { onLogout(); toggleProfileDialog() }}>
                                <a className="flex items-center justify-between">
                                    <p>Logout</p>
                                    <FiLogOut className="h-5 w-5" />
                                </a>
                            </li>
                            {user?.role === "instructor" && <li className="flex text-base cursor-pointer hover:bg-gray-100 rounded text-center shadow-md bg-purple-400 text-white mt-2" onClick={toggleProfileDialog}>
                                <Link to="/admin" className="w-full p-2">Dashboard</Link>
                            </li>}
                        </ProfileDialog>
                    </div>
                    {user ? <div className="relative hidden sm:block" >
                        <span className=" hidden sm:flex items-center justify-center p-1 cursor-pointer" onClick={(e) => {
                            e.stopPropagation();
                            toggleProfileDialog();
                        }} >
                            <img className="h-10 w-10 object-cover rounded-full" src={user?.photoUrl || "/avatar.svg"} alt="" />
                        </span>
                        <ProfileDialog show={openProfileDialog} className="absolute right-0 top-12 w-[200px] border h-fit rounded-lg p-2 bg-white">
                            <li className="p-2 text-sm font-bold"><a>My Account</a></li>
                            <hr className="my-1" />
                            <li className="flex text-sm cursor-pointer hover:bg-gray-100 rounded"
                                onClick={toggleProfileDialog} >
                                <Link to="/my-learning" className="w-full p-2">My Learning</Link>
                            </li>
                            <li className="text-sm cursor-pointer hover:bg-gray-100 rounded flex" onClick={toggleProfileDialog}>
                                <Link to="/profile" className="p-2 w-full">Profile</Link>
                            </li>
                            <li className="p-2 text-sm cursor-pointer hover:bg-gray-100 rounded" onClick={() => { onLogout(); toggleProfileDialog() }}>
                                <a className="flex items-center justify-between">
                                    <p>Logout</p>
                                    <FiLogOut className="h-4 w-4" />
                                </a>
                            </li>
                            {user?.role === "instructor" && <li className="text-center flex text-sm cursor-pointer shadow-md hover:bg-purple-400 rounded bg-purple-500 text-white mt-2" onClick={toggleProfileDialog} >
                                <Link to="/admin" className="w-full p-2">Dashboard</Link>
                            </li>}
                        </ProfileDialog>
                    </div> : <ul className="sm:flex items-center gap-2 hidden">
                        <li className="text-sm font-semibold hover:bg-gray-100 transition-all duration-150 cursor-pointer border"><Link to="/login" className="px-4 py-2 block">Log in</Link></li>
                        <li className="text-sm font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-150 cursor-pointer"><Link to="/register" className="py-2 px-4 block">Sign up</Link></li>
                    </ul>}
                    <button className="hover:bg-gray-100 transition-all duration-150 p-2 cursor-pointer border relative hidden sm:block rounded-md" onClick={(e) => {
                        toggleThemeDialog();
                        e.stopPropagation();
                    }}>
                        <img className="h-5 w-5" src="/sun.png" alt="" />
                        <ul hidden={!openThemeDialog} className="absolute top-11 right-0 w-[100px] border rounded-lg p-2 bg-white">
                            <li className="py-1 px-2 text-start text-sm cursor-pointer hover:bg-gray-100 rounded"><a>Dark</a></li>
                            <li className="py-1 px-2 text-start text-sm cursor-pointer hover:bg-gray-100 rounded"><a>Light</a></li>
                        </ul>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Navbar;