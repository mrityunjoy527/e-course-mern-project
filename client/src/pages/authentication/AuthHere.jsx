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
        <div className="flex flex-col items-center mt-[calc(60px+7%)] h-full">
            <div className="sm:w-[calc(25rem)] w-full flex flex-col gap-2">
                <div className="flex items-center justify-between bg-gray-200 p-1 rounded-lg">
                    <Link to="/register" className={`flex-1 ${!showLogin && "bg-white"} font-semibold text-base rounded-lg py-1 text-center`} onClick={() => { setShowLogin(false); }}>Register</Link>
                    <Link to="/login" className={`flex-1 ${showLogin && "bg-white"} py-1 font-semibold text-base rounded-lg text-center`} onClick={() => { setShowLogin(true); }}>Login</Link>
                </div>
                {showLogin ? <Login /> : <Register />}
            </div>
        </div>
    )
}