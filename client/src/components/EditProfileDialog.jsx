import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { toast } from "react-toastify";
import compressImage from '../utils/useCompress';
import Progress from "./Progress";

function EditProfileDialog({ removeDialog, updateProfile, status }) {

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
        const toastId = toast(<Progress text="Updating..." />, { theme: "dark", customProgressBar: true, closeButton: false, });
        const formData = new FormData();
        formData.append("name", name);
        const compressedProfilePhoto = await compressImage(profilePhoto);
        formData.append("profilePhoto", compressedProfilePhoto);
        const res = await updateProfile(formData);
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
                    removeDialog();
                }
            });
        }
    }

    return (
        <div className="relative bg-white flex flex-col items-start justify-between py-6 px-8 gap-10 rounded-lg z-50" onClick={(e) => e.stopPropagation()}>
            <RxCross2 onClick={removeDialog} className="absolute right-5 top-5 w-5 h-5 cursor-pointer active:border active:border-black rounded-md" />
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
                    <button disabled={status === "loading"} type="submit" className="text-base font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-150 py-2 px-4 cursor-pointer rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditProfileDialog;