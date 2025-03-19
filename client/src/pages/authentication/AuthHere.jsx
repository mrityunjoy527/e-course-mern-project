import { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";
import { Link } from "react-router-dom";

export default function AuthHere({ action }) {

    const [showLogin, setShowLogin] = useState(action === "login");

    useEffect(() => {
        setShowLogin(action === "login");
    }, [action]);

    return (
        <div className="flex flex-col items-center justify-center mt-[60px] h-full px-3">
            <div className="sm:w-[calc(25rem)] w-full flex flex-col gap-2 mt-20">
                <div className="flex items-center justify-between bg-gray-200 dark:bg-gray-700 p-1 rounded-lg transition-all duration-1000 text-black dark:text-white">
                    <Link to="/register" className={`flex-1 ${!showLogin && "bg-white dark:bg-gray-800"} font-semibold text-base rounded-lg py-1 text-center`} onClick={() => { setShowLogin(false); }}>Register</Link>
                    <Link to="/login" className={`flex-1 ${showLogin && "bg-white dark:bg-gray-800"} py-1 font-semibold text-base rounded-lg text-center`} onClick={() => { setShowLogin(true); }}>Login</Link>
                </div>
                {showLogin ? <Login /> : <Register />}
            </div>
        </div>
    )
}