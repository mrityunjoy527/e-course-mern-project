import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import useAuth from "../../utils/useAuth";
import { useMutation } from "react-query";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer, Flip } from "react-toastify";
import Progress from "../../components/Progress";

function Login() {

    const { register, handleSubmit, reset } = useForm();
    const [show, setShow] = useState(false);
    const [showOutline, setShowOutline] = useState(false);
    const { user, loginUser } = useAuth();
    const navigate = useNavigate();

    const { mutateAsync: onLogin, status } = useMutation({
        mutationFn: loginUser,
    });

    async function onSubmit(userData) {
        const toastId = toast(<Progress text="Logging..." />, {
            theme: "dark",
            closeButton: false,
            customProgressBar: true,
        }
        );
        const res = await onLogin(userData);
        if (!res.user) {
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
                    navigate("/profile", { replace: true });
                }
            });
        }
    }

    return (
        <div
            className="w-full px-4 pb-4 rounded-lg border-2 border-gray-300 flex flex-col gap-5 bg-white">
            <ToastContainer
                position="bottom-right"
                transition={Flip}
                pauseOnFocusLoss={false}
            />
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
                    className="py-2 px-3 text-base border rounded-md border-gray-300 ring-white"
                />
                <label
                    htmlFor="password"
                    className="text-base font-semibold">Password</label>
                <div
                    className={`flex items-center py-2 px-3 rounded-md ${!showOutline && "border border-gray-300"} gap-1 ${showOutline && "border-2 border-black"}`}>
                    <input
                        {...register("password", { required: true })}
                        type={!show ? "password" : "text"}
                        onFocus={() => { setShowOutline(true) }}
                        onBlur={() => setShowOutline(false)}
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
                    disabled={status === 'loading'}
                    className="mt-4 py-2 px-4 bg-black text-white font-semibold text-base w-fit rounded-lg active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed">
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;