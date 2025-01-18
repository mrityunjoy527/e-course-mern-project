import { useEffect, useState } from "react";
import EditProfileDialog from "../components/EditProfileDialog";
import courses from "../assets/course";
import CourseItem from "../components/CourseItem";
import { useMutation, useQuery } from "react-query";
import useAuth from "../utils/useAuth";
import Modal from "../components/Modal";
import useEditProfileDialog from "../utils/useEditProfileDialog";
import { Flip, ToastContainer } from "react-toastify";

function Profile() {

    const { setScroll } = useEditProfileDialog();
    const [showDialog, setShowDialog] = useState(false);
    const { user, updateProfile } = useAuth();

    const { mutateAsync, status } = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            refetch();
        }
    });

    return (
        <div className="flex flex-col md:items-start items-center px-6 mx-auto mt-[60px] max-w-screen-xl w-full">
            <ToastContainer
                position="bottom-right"
                transition={Flip}
                pauseOnFocusLoss={false}
            />
            {showDialog && <Modal removeDialog={() => { setShowDialog(false); setScroll(false); }}>
                <EditProfileDialog removeDialog={() => { setShowDialog(false); setScroll(false); }} updateProfile={mutateAsync} status={status} />
            </Modal>}
            <h1 className="font-bold text-2xl uppercase mt-5">Profile</h1>
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
                {user?.enrolledCourses?.length === 0 ? <p className="text-lg">You haven't enrolled yet</p> : user?.enrolledCourses?.map((course) => (<CourseItem key={course._id} course={course} />))}
            </div>
        </div>
    )
}

export default Profile;