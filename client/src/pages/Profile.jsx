
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

function Profile() {

    const { setScroll } = useEditProfileDialog();
    const [showDialog, setShowDialog] = useState(false);
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

    useEffect(() => {
        if (isSuccess) {
            if (!data?.user) toast.error(data?.message ?? "Something went wrong!", { id: 4 });
            else {
                setShowDialog(false);
                setScroll(false);
                toast.success(data?.message, { id: 4 });
            }
        }
        if (error) {
            toast.error("Something went wrong!", { id: 4 });
        }
    }, [isSuccess, error]);

    return (
        <div className="flex flex-col md:items-start items-center px-6 mx-auto mt-[60px] max-w-screen-xl w-full">
            {showDialog && <Modal removeDialog={() => { setShowDialog(false); setScroll(false); }}>
                <div className="relative bg-white flex flex-col items-start justify-between py-6 px-8 gap-10 rounded-lg z-50" onClick={(e) => e.stopPropagation()}>
                    <RxCross2 onClick={() => { setShowDialog(false); setScroll(false); }}
                        className="absolute right-5 top-5 w-5 h-5 cursor-pointer active:border active:border-black rounded-md" />
                    <div className="flex flex-col items-start">
                        <p className="text-xl font-semibold">Edit Profile</p>
                        <p className="text-base text-gray-500">Make changes to your profile here. Click save when you're done.</p>
                    </div>
                    <form action="" className="flex-col" onSubmit={onSubmit}>
                        <div className="flex flex-col items-center w-full gap-5">
                            <div className="flex items-center justify-between w-full">
                                <p className="text-lg font-semibold w-[30%]">Name</p>
                                <input type="text" id="name" name="name" className="w-[70%] border border-gray-300 rounded-md px-3 py-2" placeholder="Name" value={name} onChange={inputHandler} />
                            </div>
                            <div className="flex items-center justify-between w-full">
                                <p className="text-lg font-semibold w-[30%]">Profile Photo</p>
                                <input type="file" id="photo" accept="image/*" name="photo" className="w-[70%] border border-gray-300 rounded-md px-3 py-2 file:bg-white file:border-none file:font-semibold file:underline file:cursor-pointer text-gray-500" onChange={fileHandler} />
                            </div>
                        </div>
                        <div className="text-end w-full mt-5">
                            <button disabled={isLoading} type="submit" className="text-base font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-150 py-2 px-4 cursor-pointer rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed">
                                {isLoading ? <Loader className="h-5 w-5" text="Please wait..." col="white" /> : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>}
            <h1 className="font-bold md:text-2xl text-xl uppercase mt-5">Profile</h1>
            <div className="flex md:flex-row flex-col items-center gap-8 w-full mt-10">
                <img className="h-[10rem] w-[10rem] object-cover rounded-full" src={user?.photoUrl || "./avatar.svg"} alt="" />
                <div className="flex flex-col md:items-start items-center justify-between flex-1 h-full gap-3 w-full">
                    <p className="text-lg text-gray-700 truncate w-full md:text-start text-center"><span className="font-semibold mr-2 text-black">Name:</span>{user?.username}</p>
                    <p className="text-lg text-gray-700 truncate w-full md:text-start text-center"><span className="font-semibold mr-2 text-black">Email:</span>{user?.email}</p>
                    <p className="text-lg text-gray-700 truncate w-full md:text-start text-center uppercase"><span className="font-semibold mr-2 text-black normal-case">Role:</span>{user?.role}</p>
                    <button onClick={() => { setShowDialog(true); setScroll(true); }} className="text-sm font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-150 py-2 px-4 cursor-pointer rounded-lg">Edit Profile</button>
                </div>
            </div>
            <h1 className="font-semibold text-xl mt-10">Courses you're enrolled in </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mt-5 w-full">
                {user?.enrolledCourses?.length === 0 ? <p className="text-lg">You haven't enrolled to any course yet</p> : user?.enrolledCourses?.map((course) => (<CourseItem key={course._id} course={course} />))}
            </div>
        </div>
    )
}

export default Profile;