
import CourseItem from "../components/CourseItem";
import { useMutation } from "react-query";
import useAuth from "../utils/useAuth";
import Modal from "../components/Modal";
import useEditProfileDialog from "../utils/useEditProfileDialog";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-hot-toast";
import compressImage from '../utils/useCompress';
import Loader from "../components/Loader";
import { useDarkModeContext } from "../utils/DarkModeContext";
import { Link } from "react-router-dom";

function Profile() {

    const { setScroll } = useEditProfileDialog();
    const [showDialog, setShowDialog] = useState(false);
    const { isDarkMode } = useDarkModeContext();
    const { user, updateProfile } = useAuth();

    const { mutateAsync: onUpdate, isLoading, isSuccess, data, error } = useMutation({
        mutationFn: updateProfile,
    });
    const [name, setName] = useState("");
    const [profilePhoto, setProfilePhoto] = useState(null);

    function inputHandler(e) {
        setName(e.target.value);
    }

    function fileHandler(e) {
        const file = e.target.files?.[0];
        if (file) setProfilePhoto(file);
    }

    async function onSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", name);
        if (profilePhoto) {
            const compressedProfilePhoto = await compressImage(profilePhoto);
            formData.append("profilePhoto", compressedProfilePhoto);
        }
        await onUpdate(formData);
    }

    console.log(user);

    useEffect(() => {
        if (isSuccess) {
            if (!data?.user) toast.error(data?.message ?? "Something went wrong!", { id: 4 });
            else {
                setShowDialog(false);
                setName("");
                setScroll(false);
                toast.success(data?.message, { id: 4 });
            }
        }
        if (error) {
            toast.error("Something went wrong!", { id: 4 });
        }
    }, [isSuccess, error]);

    return (
        <div className="flex flex-col md:items-start items-center px-3 mx-auto mt-[60px] max-w-screen-xl w-full dark:text-white text-black">
            {showDialog && <Modal removeDialog={() => { setShowDialog(false); setScroll(false); }}>
                <div className="relative bg-white dark:bg-gray-800 flex flex-col items-start justify-between py-6 px-8 gap-10 rounded-lg z-50" onClick={(e) => e.stopPropagation()}>
                    <RxCross2 onClick={() => { setShowDialog(false); setScroll(false); }}
                        className="absolute right-5 top-5 w-5 h-5 cursor-pointer active:border active:border-black rounded-md" />
                    <div className="flex flex-col items-start">
                        <p className="text-xl font-semibold">Edit Profile</p>
                        <p className="text-base text-gray-400">Make changes to your profile here. Click save when you're done.</p>
                    </div>
                    <form action="" className="flex-col" onSubmit={onSubmit}>
                        <div className="flex flex-col items-center w-full gap-5">
                            <div className="flex items-center justify-between w-full">
                                <p className="text-lg font-semibold w-[30%]">Name</p>
                                <input type="text" id="name" name="name" className="text-base focus:outline-2 outline-1 outline rounded-md outline-gray-300 dark:outline-gray-600 bg-white dark:bg-gray-800 focus:dark:outline-gray-400 focus:outline-black w-[70%]  px-3 py-2 placeholder:dark:text-gray-400 placeholder:text-gray-500" placeholder="Name" value={name} onChange={inputHandler} />
                            </div>
                            <div className="flex items-center justify-between w-full">
                                <p className="text-lg font-semibold w-[30%]">Profile Photo</p>
                                <input type="file" id="photo" accept="image/*" name="photo" className="w-[70%] outline outline-1 outline-gray-300 dark:outline-gray-600 rounded-md px-3 py-2 file:bg-white file:dark:bg-gray-800 file:border-none file:font-semibold file:underline file:cursor-pointer file:dark:text-white dark:text-gray-400 text-gray-500 " onChange={fileHandler} />
                            </div>
                        </div>
                        <div className="text-end w-full mt-5">
                            <button disabled={isLoading} type="submit" className="text-base font-semibold text-white dark:text-black bg-black dark:bg-gray-200 hover:bg-gray-800 hover:dark:bg-gray-400 transition-all duration-150 py-2 px-4 cursor-pointer rounded-lg disabled:bg-gray-500 disabled:dark:bg-gray-500 disabled:cursor-not-allowed">
                                {isLoading ? <Loader className="h-5 w-5" text="Please wait..." col={isDarkMode ? "black" : "white"} /> : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>}
            <div className="flex flex-row md:items-start items-center md:justify-between justify-center w-full mt-5">
                <h1 className="font-bold md:text-2xl text-xl uppercase">Profile</h1>
                {user?.role === "student" && <Link to='/profile/start-teaching' className="hidden md:block py-2 px-4 dark:bg-gray-200 text-black font-semibold text-sm w-fit rounded-lg md:text-base text-nowrap hover:bg-gray-200 hover:dark:bg-gray-400 transition-all text-center duration-150 sm:w-fit shadow-md cursor-pointer outline outline-1 outline-gray-300 dark:outline-none bg-white">
                    Start Teaching
                </Link>}
            </div>
            <div className="flex md:flex-row flex-col items-center gap-8 w-full mt-10 flex-1">
                <img className="h-[10rem] w-[10rem] object-cover rounded-full" src={user?.photoUrl || "/avatar.svg"} alt="" />
                <div className="flex flex-col md:items-start items-center justify-between flex-1 h-full gap-3 w-full">
                    <p className="text-lg text-gray-700 dark:text-gray-400 truncate w-full md:text-start text-center"><span className="font-semibold mr-2 text-black dark:text-white">Name:</span>{user?.username}</p>
                    <p className="text-lg text-gray-700 dark:text-gray-400 truncate w-full md:text-start text-center"><span className="font-semibold mr-2 text-black dark:text-white">Email:</span>{user?.email}</p>
                    <p className="text-lg text-gray-700 dark:text-gray-400 truncate w-full md:text-start text-center uppercase"><span className="font-semibold mr-2 text-black dark:text-white normal-case">Role:</span>{user?.role}</p>
                    <div className="flex items-center gap-3 sm:w-fit w-full">
                        <button onClick={() => { setShowDialog(true); setScroll(true); }} className="md:text-base text-sm font-semibold text-white bg-black dark:bg-gray-700 hover:bg-gray-800 hover:dark:bg-gray-800 transition-all duration-150 py-2 px-4 w-full sm:w-fit cursor-pointer rounded-lg border dark:border-gray-700 border-gray-200">Edit Profile</button>
                        {user?.role === "student" && <Link to='/profile/start-teaching' className="py-2 md:hidden block px-4 bg-white dark:bg-gray-200 text-black font-semibold text-sm w-full sm:w-fit rounded-lg md:text-base hover:bg-gray-200 hover:dark:bg-gray-400 transition-all text-center duration-150 cursor-pointer outline outline-1 outline-gray-300 dark:outline-none">
                            Start Teaching
                        </Link>}
                    </div>
                </div>
            </div>
            <h1 className="font-semibold text-xl mt-10">Courses you're enrolled in </h1>
            {user?.enrolledCourses?.length === 0 && <p className="text-lg mt-5 text-center sm:text-start">You haven't enrolled to any course yet</p>}
            {user?.enrolledCourses?.length !== 0 && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mt-5 w-full">
                {user?.enrolledCourses?.map((course) => (<CourseItem key={course._id} course={course} />))}
            </div>}
        </div>
    )
}

export default Profile;