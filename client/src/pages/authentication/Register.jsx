import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import useAuth from "../../utils/useAuth";
import { useMutation } from "react-query";
import { useNavigate } from 'react-router-dom';
import { Flip, toast, ToastContainer } from 'react-toastify';
import Progress from "../../components/Progress";

function Register() {

    const { register, handleSubmit, reset } = useForm();
    const [show, setShow] = useState(false);
    const [showOutline, setShowOutline] = useState(false);
    const { registerUser } = useAuth();
    const navigate = useNavigate();

    const { mutateAsync: onRegister, status } = useMutation({
        mutationFn: registerUser,
    });

    async function onSubmit(userData) {
        const toastId = toast(<Progress text="Registering..." />, {
            theme: "dark",
            closeButton: false,
            customProgressBar: true,
        }
        );
        const res = await onRegister(userData);
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
                    navigate("/login", { replace: true });
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
                    className={`flex items-center py-2 px-3 rounded-md ${!showOutline && "border border-gray-300"} gap-1 ${showOutline && "border-2 border-black"}`}>
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
                    disabled={status === "loading"}
                    className="mt-4 py-2 px-4 bg-black text-white  font-semibold text-base w-fit rounded-lg active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed">
                    Register
                </button>
            </form>
        </div >
    );
}

export default Register;