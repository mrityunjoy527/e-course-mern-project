import { useEffect, } from "react";
import { FiLogOut } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import ProfileDialog from "./ProfileDialog";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../utils/useAuth";
import { useMutation } from "react-query";
import { toast } from "react-hot-toast";
import useProfileDialog from "../utils/useProfileDialog";
import { AiOutlineSun } from "react-icons/ai";
import { AiOutlineMoon } from "react-icons/ai";
import { useDarkModeContext } from "../utils/DarkModeContext";

function Navbar() {

    const { isDarkMode, setDarkMode } = useDarkModeContext();
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
        <div className="w-screen fixed left-0 top-0 bg-white dark:bg-gray-900 z-40 px-3 border-b dark:border-gray-700 border-gray-300">
            <div className="flex max-w-screen-xl items-center mx-auto justify-between h-[60px]">
                <Link to="/" className="flex items-center gap-3">
                    <img className="h-10 w-10 hidden text-indigo-600 sm:block" src="/skill.png" alt="" />
                    <h1 className="font-extrabold text-indigo-500 text-2xl">SkillSprint</h1>
                </Link>
                <div className="flex items-center gap-3 sm:relative">
                    <IoMenu className="sm:hidden block h-9 w-9 cursor-pointer dark:text-gray-500 text-black" onClick={(e) => {
                        toggleProfileDialog();
                        e.stopPropagation();
                    }} />
                    <div className={`sm:hidden absolute top-0 right-0 flex items-center h-screen w-screen ${!openProfileDialog ? "hidden" : ""}`}>
                        <div className="h-full w-[30%] bg-black opacity-80" >
                        </div>
                        <ProfileDialog show={openProfileDialog} className="absolute right-0 h-full top-0 w-[70%] p-2 bg-white dark:bg-gray-800 dark:text-white text-black" >
                            <header className="w-full flex items-center justify-end p-2 dark:text-gray-500 text-black" >
                                <RxCross2 className="h-9 w-9 text-end cursor-pointer" onClick={(e) => {
                                    toggleProfileDialog();
                                    e.stopPropagation();
                                }} />
                            </header>
                            <div className="flex items-center justify-between p-2 sm:hidden">
                                <img className="h-10 w-10" src="/skill.png" alt="" />
                                <button className="hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-150 p-2 border-gray-200 dark:border-gray-700 rounded-md cursor-pointer border relative" onClick={() => setDarkMode(!isDarkMode)}>
                                    {
                                        isDarkMode ? <AiOutlineMoon className="h-5 w-5 text-white" onClick={() => localStorage.setItem("theme", "light")} />
                                            : <AiOutlineSun className="h-5 w-5 text-black" onClick={() => localStorage.setItem("theme", "dark")} />
                                    }
                                </button>
                            </div>
                            {user ? <div className="p-2">
                                <li className="p-2 text-lg font-bold"><a>My Account</a></li>
                                <div className="my-1 h-[1px] dark:bg-gray-700 bg-gray-300" />
                                <li className="flex text-base cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900 rounded" onClick={toggleProfileDialog} >
                                    <Link to="/my-learning" className="w-full p-2">My Learning</Link>
                                </li>
                                <li className="flex text-base cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900 rounded" onClick={toggleProfileDialog}>
                                    <Link to="/profile" className="w-full p-2">Profile</Link>
                                </li>
                                <li className="p-2 text-base cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900 rounded" onClick={() => { onLogout(); toggleProfileDialog() }}>
                                    <a className="flex items-center justify-between">
                                        <p>Logout</p>
                                        <FiLogOut className="h-5 w-5" />
                                    </a>
                                </li>
                                {user?.role === "instructor" && <li className="flex text-base cursor-pointer hover:bg-purple-600 dark:hover:bg-purple-900 rounded text-center shadow-md bg-purple-500 dark:bg-purple-800 text-white mt-2" onClick={toggleProfileDialog}>
                                    <Link to="/admin" className="w-full p-2">Dashboard</Link>
                                </li>}
                            </div> : <ul className=" flex flex-col gap-5 p-2">
                                <li className="my-1 h-[1px] dark:bg-gray-700 bg-gray-300" />
                                <li className="text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 transition-all bg-white duration-150 cursor-pointer text-black dark:text-white border dark:border-gray-700 border-gray-200 rounded-md" onClick={toggleProfileDialog} >
                                    <Link to="/login" className="px-4 py-2 block">Log in</Link>
                                </li>
                                <li className="text-sm font-semibold text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 transition-all rounded-md duration-150 cursor-pointer" onClick={toggleProfileDialog} >
                                    <Link to="/register" className="py-2 px-4 block">Sign up</Link>
                                </li>
                            </ul>}
                        </ProfileDialog>
                    </div>
                    {user ? <div className="relative hidden sm:block" >
                        <span className=" hidden sm:flex items-center justify-center p-1 cursor-pointer" onClick={(e) => {
                            e.stopPropagation();
                            toggleProfileDialog();
                        }} >
                            <img className="h-10 w-10 object-cover rounded-full" src={user?.photoUrl || "/avatar.svg"} alt="" />
                        </span>
                        <ProfileDialog show={openProfileDialog} className="absolute right-0 top-12 w-[200px]  h-fit rounded-lg p-2 bg-white dark:bg-gray-800 text-black dark:text-white border-[1px] dark:border-gray-700 border-gray-200">
                            <li className="p-2 text-sm font-bold"><a>My Account</a></li>
                            <div className="my-1 h-[1px] bg-gray-300 dark:bg-gray-700" />
                            <li className="flex text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900 rounded"
                                onClick={toggleProfileDialog} >
                                <Link to="/my-learning" className="w-full p-2">My Learning</Link>
                            </li>
                            <li className="text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900 rounded flex" onClick={toggleProfileDialog}>
                                <Link to="/profile" className="p-2 w-full">Profile</Link>
                            </li>
                            <li className="p-2 text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900 rounded" onClick={() => { onLogout(); toggleProfileDialog() }}>
                                <a className="flex items-center justify-between">
                                    <p>Logout</p>
                                    <FiLogOut className="h-4 w-4" />
                                </a>
                            </li>
                            {user?.role === "instructor" && <li className="text-center flex text-sm cursor-pointer shadow-md hover:bg-purple-600 dark:hover:bg-purple-900 rounded bg-purple-500 dark:bg-purple-800 text-white mt-2" onClick={toggleProfileDialog} >
                                <Link to="/admin" className="w-full p-2">Dashboard</Link>
                            </li>}
                        </ProfileDialog>
                    </div> : <ul className="sm:flex items-center gap-2 hidden">
                        <li className="text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 transition-all bg-white duration-150 cursor-pointer text-black dark:text-white border dark:border-gray-700 border-gray-200">
                            <Link to="/login" className="px-4 py-2 block">Log in</Link>
                        </li>
                        <li className="text-sm font-semibold text-white dark:text-black bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-150 cursor-pointer">
                            <Link to="/register" className="py-2 px-4 block">Sign up</Link>
                        </li>
                    </ul>}
                    <button className="hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 transition-all duration-150 p-2 cursor-pointer border border-gray-200 dark:border-gray-700 relative hidden sm:block rounded-md" onClick={(e) => {
                        toggleThemeDialog();
                        e.stopPropagation();
                    }}>
                        {
                            isDarkMode ? <AiOutlineMoon className="h-5 w-5 text-white" />
                                : <AiOutlineSun className="h-5 w-5 text-black" />
                        }
                        <ul hidden={!openThemeDialog} className="absolute top-11 text-black dark:text-white right-0 w-[100px] rounded-lg p-2 bg-white dark:bg-gray-800 border-[1px] dark:border-gray-700 border-gray-200 ">
                            <li className="py-1 px-2 text-start text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900 rounded" onClick={() => { setDarkMode(true); localStorage.setItem("theme", "dark"); }}><a >Dark</a></li>
                            <li className="py-1 px-2 text-start text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-900 rounded" onClick={() => { setDarkMode(false); localStorage.setItem("theme", "light"); }}><a >Light</a></li>
                        </ul>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Navbar;