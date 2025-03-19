import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import useAuth from "../../utils/useAuth";
import { useMutation } from "react-query";
import { toast } from "react-hot-toast";
import Loader from "../../components/Loader";
import { useDarkModeContext } from "../../utils/DarkModeContext";

function Login() {

    const { register, handleSubmit } = useForm();
    const [show, setShow] = useState(false);
    const [showOutline, setShowOutline] = useState(false);
    const { user, loginUser, setData } = useAuth();
    const {isDarkMode} = useDarkModeContext();

    const { data, mutateAsync: onLogin, isSuccess, isLoading, error } = useMutation({
        mutationFn: loginUser,
    });

    async function onSubmit(userData) {
        await onLogin(userData);
    }


    useEffect(() => {
        if (isSuccess) {
            if (!data?.user) {
                toast.error(data?.message ?? "Something went wrong!", { id: 3 });
            }
            else {
                setData({ user: data.user, isAuthenticated: true, });
                toast.success(data?.message, { id: 3 });
            }
        }
        if (error) {
            toast.error("Something went wrong!", { id: 3 });
        }
    }, [isSuccess, error]);

    return (
        <div
            className="w-full p-4 rounded-lg border-2 border-gray-300 dark:border-gray-700 flex flex-col gap-5 bg-white dark:bg-gray-800 dark:text-white text-black">
            <div>
                <span
                    className="text-base font-semibold">
                    Login</span>
                <p
                    className="text-base text-gray-400">
                    Please login to access courses and features</p>
            </div>
            <form
                className="flex flex-col gap-2"
                onSubmit={handleSubmit(onSubmit)}>
                <label
                    htmlFor="email"
                    className="text-base font-semibold">Email</label>
                <input
                    {...register("email", { required: true, value: user?.email })}
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="true"
                    placeholder="Enter email..."
                    className="py-2 px-3 text-base border-none focus:outline-2 outline-1 outline rounded-md outline-gray-300 dark:outline-gray-600 bg-white dark:bg-gray-800 placeholder:dark:text-gray-400 focus:dark:outline-gray-400 focus:outline-black"
                />
                <label
                    htmlFor="password"
                    className="text-base font-semibold">Password</label>
                <div
                    className={`flex items-center py-2 px-3 rounded-md outline bg-white dark:bg-gray-800 ${!showOutline && "outline-1 outline-gray-300 dark:outline-gray-600"} gap-1 ${showOutline && "outline-2 outline-black dark:outline-gray-400"}`}>
                    <input
                        {...register("password", { required: true })}
                        type={!show ? "password" : "text"}
                        onFocus={() => setShowOutline(true)}
                        onBlur={() => setShowOutline(false)}
                        name="password"
                        id="password"
                        placeholder="Enter password..."
                        className=" text-base flex-1 border-none outline-none bg-white dark:bg-gray-800 placeholder:dark:text-gray-400" />
                    {!show ?
                        <IoEyeOff
                            onClick={() => { setShow(true); }}
                            className="text-2xl cursor-pointer" /> :
                        <IoEye
                            onClick={() => { setShow(false); }}
                            className="text-2xl cursor-pointer" />
                    }
                </div>
                <button
                    disabled={isLoading}
                    className="mt-4 py-2 px-4 bg-black dark:bg-gray-200 text-white dark:text-black font-semibold sm:text-base text-sm w-fit rounded-lg active:scale-95 disabled:bg-gray-500 disabled:dark:bg-gray-500 disabled:cursor-not-allowed">
                    {isLoading ? <Loader className="h-5 w-5" text="Please wait..." col={isDarkMode? "black" :"white"} /> : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;