import { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import ProfileDialog from "./ProfileDialog";
import { LuSchool } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../utils/useAuth";
import { useMutation } from "react-query";
import { Slide, toast, ToastContainer } from "react-toastify";
import Progress from "./Progress";

function Navbar() {

    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const [showThemeOptions, setShowThemeOptions] = useState(false);
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const { mutateAsync: logout } = useMutation({
        mutationFn: logoutUser
    });

    async function onLogout() {
        const toastId = toast(<Progress text="Logging out..." />, { theme: "dark", customProgressBar: true, closeButton: false });
        const res = await logout();
        if (!res.isLoggedOut) {
            toast.update(
                toastId, {
                render: res.message,
                type: "error",
                customProgressBar: false,
                isLoading: false,
                autoClose: 3000,
            });
        } else {
            toast.update(
                toastId, {
                render: res.message,
                customProgressBar: false,
                type: "success",
                isLoading: false,
                autoClose: 3000,
                onClose() {
                    navigate("/login", { replace: true });
                }
            });
        }
    }

    return (
        <div className="w-screen fixed left-0 top-0 bg-white z-40 px-2 border-b-2 border-gray-100">
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                transition={Slide} />
            <div className="flex max-w-screen-xl items-center mx-auto justify-between h-[60px]">
                <Link to="/" className="flex items-center gap-3">
                    <LuSchool className="h-8 w-8 hidden sm:block" />
                    <h1 className="font-extrabold text-2xl">E-Learning</h1>
                </Link>
                <div className="flex gap-3 sm:relative">
                    <IoMenu className="sm:hidden block h-9 w-9 cursor-pointer" onClick={() => { setShowProfileOptions(true); }} />
                    <div className={`sm:hidden absolute top-0 right-0 flex items-center h-screen w-screen ${!showProfileOptions ? "hidden" : ""}`}>
                        <div className="h-full w-[30%] bg-black opacity-70" onClick={() => { setShowProfileOptions(false); setShowThemeOptions(false); }} >
                        </div>
                        <ProfileDialog show={showProfileOptions} className="absolute right-0 h-full top-0 w-[70%] border rounded-l-xl p-2 bg-white">
                            <header className="w-full flex items-center justify-end p-2" onClick={() => { setShowProfileOptions(false); }}>
                                <RxCross2 className="h-9 w-9 text-end cursor-pointer" />
                            </header>
                            <div className="flex items-center justify-between p-2 sm:hidden">
                                <img className="h-8 w-8" src="./school.png" alt="" />
                                <button className="hover:bg-gray-100 transition-all duration-150 p-2 rounded-md cursor-pointer border relative" onClick={() => { setShowThemeOptions(prev => !prev); }}>
                                    <img className="h-5 w-5" src="./sun.png" alt="" />
                                    <ul hidden={!showThemeOptions} className="shadow-md absolute top-11 right-0 w-[100px] border rounded-lg p-2 bg-white">
                                        <li className="py-1 px-2 text-start text-sm cursor-pointer hover:bg-gray-100 rounded"><a>Dark</a></li>
                                        <li className="py-1 px-2 text-start text-sm cursor-pointer hover:bg-gray-100 rounded"><a>Light</a></li>
                                    </ul>
                                </button>
                            </div>
                            <li className="p-2 text-lg font-bold"><a>My Account</a></li>
                            <hr className="my-1" />
                            {user?.role === "instructor" && <li className="p-2 text-base cursor-pointer hover:bg-gray-100 rounded" onClick={() => { setShowProfileOptions(false); }}><a>Dashboard</a></li>}
                            <li className="p-2 text-base cursor-pointer hover:bg-gray-100 rounded" onClick={() => { setShowProfileOptions(false); }}><a>My Learning</a></li>
                            <li className="p-2 text-base cursor-pointer hover:bg-gray-100 rounded" onClick={() => { setShowProfileOptions(false); }}><Link to="/profile">Edit Profile</Link></li>
                            <li className="p-2 text-base cursor-pointer hover:bg-gray-100 rounded" onClick={() => { setShowProfileOptions(false); onLogout(); }}>
                                <a className="flex items-center justify-between">
                                    <p>Logout</p>
                                    <FiLogOut className="h-5 w-5" />
                                </a>
                            </li>
                        </ProfileDialog>
                    </div>
                    {user ? <div className="relative hidden sm:block">
                        <span onClick={() => { setShowThemeOptions(false); setShowProfileOptions(prev => !prev); }} className=" hidden sm:flex items-center justify-center p-1 cursor-pointer">
                            <img className="h-10 w-10 object-cover rounded-full" src={user?.photoUrl || "./avatar.svg"} alt="" />
                        </span>
                        <ProfileDialog show={showProfileOptions} className="absolute right-0 top-12 w-[200px] border h-fit rounded-lg p-2 bg-white">
                            <li className="p-2 text-sm font-bold"><a>My Account</a></li>
                            <hr className="my-1" />
                            {user?.role === "instructor" && <li className="p-2 text-sm cursor-pointer hover:bg-gray-100 rounded" onClick={() => { setShowProfileOptions(false); }}><a>Dashboard</a></li>}
                            <li className="p-2 text-sm cursor-pointer hover:bg-gray-100 rounded" onClick={() => { setShowProfileOptions(false); }}><a>My Learning</a></li>
                            <li className="p-2 text-sm cursor-pointer hover:bg-gray-100 rounded" onClick={() => { setShowProfileOptions(false); navigate("/profile", { replace: true }); }}><Link to="/profile">Edit Profile</Link></li>
                            <li className="p-2 text-sm cursor-pointer hover:bg-gray-100 rounded" onClick={() => { onLogout(); setShowProfileOptions(false); }}>
                                <a className="flex items-center justify-between">
                                    <p>Logout</p>
                                    <FiLogOut className="h-4 w-4" />
                                </a>
                            </li>
                        </ProfileDialog>
                    </div> : <ul className="sm:flex items-center gap-2 hidden">
                        <li className="text-sm font-semibold hover:bg-gray-100 transition-all duration-150 py-2 px-4 cursor-pointer border"><Link to="/login">Log in</Link></li>
                        <li className="text-sm font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-150 py-2 px-4 cursor-pointer"><Link to="/register">Sign up</Link></li>
                    </ul>}
                    <button onClick={() => { setShowThemeOptions(prev => !prev); setShowProfileOptions(false); }} className="hover:bg-gray-100 transition-all duration-150 p-2 cursor-pointer border relative hidden sm:block rounded-md">
                        <img className="h-5 w-5" src="./sun.png" alt="" />
                        <ul hidden={!showThemeOptions} className="absolute top-12 right-0 w-[100px] border rounded-lg p-2 bg-white">
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