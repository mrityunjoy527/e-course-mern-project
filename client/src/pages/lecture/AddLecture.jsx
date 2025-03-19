import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import useCourse from "../../utils/useCourse";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiEdit } from "react-icons/bi";
import LoadingPage from "../../components/LoadingPage";
import { FiAlertCircle } from "react-icons/fi";
import Loader from "../../components/Loader";

function AddLecture() {

    const queryClient = useQueryClient();
    const { register, handleSubmit, reset } = useForm();
    const { createLecture, getCourseLectures } = useCourse();
    const [showErrorTab, setShowErrorTab] = useState(false);
    const { courseId } = useParams();
    const { isLoading, data, mutateAsync: onCreate, isSuccess, error } = useMutation({
        mutationFn: createLecture,
    });
    const { data: queryData, isLoading: queryLoading, isSuccess: querySuccess, error: queryError } = useQuery({
        queryKey: ["lectures", courseId],
        queryFn: ({ queryKey }) => getCourseLectures(queryKey[1]),
    });

    async function onSubmit(data) {
        const { lectureTitle } = data;
        await onCreate({ lectureTitle, courseId });
    }

    useEffect(() => {
        if (querySuccess) {
            if (!queryData?.lectures) {
                toast.error(queryData?.message, { id: 11 });
                setShowErrorTab(true);
            }
        }
        if (queryError) toast.error("Something went wrong!", { id: 11 });
    }, [querySuccess, queryError]);

    useEffect(() => {
        if (isSuccess) {
            if (!data?.lecture) toast.error(data?.message, { id: 10 });
            else {
                queryClient.invalidateQueries(["lectures"]);
                reset();
                toast.success(data?.message, { id: 10 });
            }
        }
        if (error) toast.error("Something went wrong!", { id: 10 });
    }, [isSuccess, error]);

    if (queryLoading) {
        return <LoadingPage />;
    }

    if (showErrorTab) return <div className='flex h-[calc(100vh-60px-10rem)] w-full items-center justify-center'>
        <div className="flex flex-col gap-2 items-center md:relative justify-center text-black dark:text-white">
            <FiAlertCircle className="text-red-600 w-14 h-14" />
            <h1 className="text-2xl font-bold">Course not found</h1>
            <p className="text-base">Sorry we couldn't find the course you are looking for</p>
        </div>
    </div>;

    return (
        <div className="flex flex-col w-full gap-4 text-black dark:text-white">
            <div className="flex flex-col items-center sm:items-start">
                <h1 className="text-2xl font-bold sm:text-start text-center">Create courses that educate, motivate, and transform lives.</h1>
                <p className="text-base sm:text-start text-center">Your journey starts here. Build courses that matter.</p>
            </div>
            <form className="flex flex-col md:text-lg text-base gap-4 mb-10" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col">
                    <label htmlFor="title" className="font-semibold">Title</label>
                    <input
                        {...register("lectureTitle", { required: true })}
                        type="text" id="title" placeholder="Your lecture title..." className="shadow-sm md:py-2 py-1 px-3 max-w-[45rem] w-full rounded-md  focus:outline-2 outline-1 outline outline-gray-300 dark:outline-gray-600 bg-white dark:bg-gray-800 placeholder:dark:text-gray-400 focus:dark:outline-gray-400 focus:outline-black" />
                </div>
                <div className="flex items-center sm:justify-start justify-center gap-4">
                    <Link to={`/admin/course/${courseId}`} className="md:text-base text-sm font-semibold rounded-md   hover:bg-gray-200 hover:dark:bg-gray-400 transition-all text-center text-black bg-white dark:bg-gray-200 duration-150 sm:w-fit w-full py-2 px-4 cursor-pointer outline outline-1 outline-gray-300 dark:outline-none ">Back to Course</Link>
                    <button disabled={isLoading} type="submit" className="md:text-base text-sm font-semibold text-white sm:w-fit text-center bg-black dark:bg-gray-700 hover:bg-gray-800 hover:dark:bg-gray-800 w-full transition-all duration-150 py-2 px-4 cursor-pointer rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed disabled:dark:bg-gray-500">
                        {isLoading ? <Loader className="h-5 w-5" text="Please wait..." col="white" /> : "Create Lecture"}
                    </button>
                </div>
            </form>
            <div className="h-[1px] bg-gray-200 dark:bg-gray-700 max-w-[45rem]"></div>
            {queryData?.lectures?.length === 0 && <p className="text-base text-gray-600 w-full text-center sm:text-start">No lectures yet</p>}
            {queryData?.lectures?.length > 0 && <div className="flex flex-col gap-3 text-base text-start text-gray-600">
                {queryData.lectures.map((lecture, i) =>
                (<div className=" flex max-w-[45rem] w-full bg-gray-100 dark:bg-gray-700 items-center justify-between rounded-md gap-3 shadow-md p-3 hover:bg-gray-200 hover:dark:bg-gray-600" key={lecture._id}>
                    <p
                        className="text-base line-clamp-2 font-bold text-black dark:text-white">
                        {`Lecture-${i + 1}: ${lecture.lectureTitle}`}
                    </p>
                    <Link to={`/admin/course/${courseId}/lecture/${lecture._id}`}>
                        <BiEdit className="w-6 h-6 cursor-pointer text-blue-600 dark:text-blue-500" />
                    </Link>
                </div>))}
            </div>}
        </div >
    )
}

export default AddLecture;