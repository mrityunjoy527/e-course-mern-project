import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import useAuth from "../../utils/useAuth";
import { useMutation } from "react-query";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Loader from "../../components/Loader";

function Register() {

    const { register, handleSubmit } = useForm();
    const [show, setShow] = useState(false);
    const [showOutline, setShowOutline] = useState(false);
    const { registerUser } = useAuth();
    const navigate = useNavigate();

    const { mutateAsync: onRegister, isLoading, isSuccess, data, error } = useMutation({
        mutationFn: registerUser,
    });

    async function onSubmit(userData) {
        await onRegister(userData);
    }

    useEffect(() => {
        if (isSuccess) {
            if (!data?.user) toast.error(data?.message ?? "Something went wrong!", { id: 2 });
            else {
                navigate("/login", { replace: true });
                toast.success(data?.message, { id: 2 });
            }
        }
        if (error) {
            toast.error("Something went wrong!", { id: 2 });
        }
    }, [isSuccess, error]);

    return (
        <div
            className="w-full p-4 rounded-lg border-2 border-gray-300 flex flex-col gap-5 bg-white">
            <div>
                <span
                    className="text-base font-semibold" onClick={() => {

                    }}>
                    Register</span>
                <p
                    className="text-base text-gray-400">
                    Please register to access courses and features</p>
            </div>
            <form
                className="flex flex-col gap-2"
                onSubmit={handleSubmit(onSubmit)}>
                <label
                    htmlFor="username"
                    className="text-base font-semibold">Username</label>
                <input
                    {...register("username", { required: true })}
                    type="username"
                    name="username"
                    id="username"
                    placeholder="Enter username..."
                    className="py-2 px-3 text-base border rounded-md border-gray-300 ring-white" />
                <label
                    htmlFor="email"
                    className="text-base font-semibold">Email</label>
                <input
                    {...register("email", { required: true })}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter email..."
                    className="py-2 px-3 text-base border rounded-md border-gray-300 ring-white" />
                <label
                    htmlFor="password"
                    className="text-base font-semibold">Password</label>
                <div
                    className={`flex items-center py-2 px-3 rounded-md outline ${!showOutline && "outline-1 outline-gray-300"} gap-1 ${showOutline && "outline-2 outline-black"}`}>
                    <input
                        {...register("password", { required: true })}
                        type={!show ? "password" : "text"}
                        onFocus={() => { setShowOutline(true); }}
                        onBlur={() => { setShowOutline(false); }}
                        name="password"
                        id="password"
                        placeholder="Enter password..."
                        className=" text-base flex-1 border-none outline-none" />
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
                    className="mt-4 py-2 px-4 bg-black text-white font-semibold sm:text-base text-sm  w-fit rounded-lg active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed">
                    {isLoading ? <Loader className="h-5 w-5" text="Please wait..." col="white" /> : "Register"}
                </button>
            </form>
        </div >
    );
}

export default Register;