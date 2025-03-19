import { HiCheckCircle, HiOutlineCheckCircle, HiOutlinePlay } from "react-icons/hi";
import ReactPlayer from "react-player";
import useCourseProgress from "../../../utils/useCourseProgress";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Loader from "../../../components/Loader";
import LoadingPage from "../../../components/LoadingPage";
import { FiAlertCircle } from "react-icons/fi";
import { useDarkModeContext } from "../../../utils/DarkModeContext";

function CourseProgress() {

    const { courseId } = useParams();
    const queryClient = useQueryClient();
    const [showErrorTab, setShowErrorTab] = useState(false);
    const { isDarkMode } = useDarkModeContext();
    const { getCourseProgress, updateCourseProgress, markAsCompleted, markAsInComplete } = useCourseProgress();
    const { data, isLoading, isSuccess, error } = useQuery({
        queryKey: ["courseProgress", courseId],
        queryFn: ({ queryKey }) => getCourseProgress(queryKey[1]),
    });

    const { mutateAsync: onUpdateCourseProgress, data: mutationData, isSuccess: mutationSuccess, error: mutationError } = useMutation({
        mutationFn: updateCourseProgress,
    });

    const { mutateAsync: onCompleted, data: onCompletedData, isLoading: onCompletedLoading, isSuccess: onCompletedSuccess, error: onCompleteError } = useMutation({
        mutationFn: markAsCompleted,
    });

    const { mutateAsync: onInComplete, data: onInCompleteData, isLoading: onInCompleteLoading, isSuccess: onInCompleteSuccess, error: onInCompleteError } = useMutation({
        mutationFn: markAsInComplete,
    });
    const [initialLecture, setInitialLecture] = useState();

    useEffect(() => {
        if (isSuccess) {
            if (!data?.data) {
                toast.error(data?.message ?? "Something went wrong!", { id: 12 });
                setShowErrorTab(true);
            }
            else {
                toast.dismiss(12);
                setInitialLecture(() => ({
                    lecture: data?.data?.courseDetails?.lectures?.[0],
                    index: 1,
                }));
            }
        }
        if (error) {
            toast.error("Something went wrong!", { id: 12 });
        }
    }, [isSuccess, error]);

    useEffect(() => {
        if (onCompletedSuccess) {
            if (!onCompletedData.ok) toast.error(onCompletedData?.message ?? "Something went wrong!", { id: 7 });
            else {
                queryClient.invalidateQueries(["courseProgress"]);
                toast.success(onCompletedData?.message ?? "Course marked as completed", { id: 7 });
            }
        }
        if (onCompleteError) {
            toast.error("Something went wrong!", { id: 7 });
        }
    }, [onCompleteError, onCompletedSuccess]);

    useEffect(() => {
        if (onInCompleteSuccess) {
            if (!onInCompleteData.ok) toast.error(onInCompleteData?.message ?? "Something went wrong!", { id: 6 });
            else {
                queryClient.invalidateQueries(["courseProgress"]);
                toast.success(onInCompleteData?.message ?? "Course marked as incomplete", { id: 6 });
            }
        }
        if (onInCompleteError) {
            toast.error("Something went wrong!", { id: 6 });
        }
    }, [onInCompleteError, onInCompleteSuccess]);

    useEffect(() => {
        if (mutationSuccess) {
            if (mutationData?.ok) {
                queryClient.invalidateQueries(["courseProgress"]);
            }
        }
    }, [mutationSuccess])

    if (isLoading) {
        return <LoadingPage />;
    }

    if (showErrorTab) return <div className='flex h-[calc(100vh-60px)] w-full items-center justify-center'>
        <div className="flex flex-col gap-2 items-center md:relative justify-center text-black dark:text-white">
            <FiAlertCircle className="text-red-600 w-14 h-14" />
            <h1 className="text-2xl font-bold">Course not found</h1>
            <p className="text-base">Sorry we couldn't find the course you are looking for</p>
        </div>
    </div>;

    const handleViewed = (lectureId) => {
        return data?.data?.progress?.some(lecture => lecture.lectureId === lectureId && lecture.viewed);
    }

    async function handleCourseProgressUpdate() {
        await onUpdateCourseProgress({ courseId, lectureId: initialLecture?.lecture?._id })
    }

    return (
        <div className="max-w-screen-xl w-full mx-auto mt-[60px] px-3 pt-3 text-black dark:text-white">
            <div className="mt-5 flex md:flex-row flex-col-reverse gap-3 items-start justify-between ">
                <h1 className="md:text-2xl text-xl font-bold">{data?.data?.courseDetails?.courseTitle}</h1>
                <button disabled={onCompletedLoading || onInCompleteLoading} className={`text-sm font-semibold transition-all duration-150 py-2 px-4 cursor-pointer rounded-md disabled:bg-gray-600  disabled:dark:bg-gray-500 disabled:cursor-not-allowed flex gap-2 items-center shadow-md outline outline-1 outline-gray-300 dark:outline-gray-700 ${data?.data?.completed ? "bg-white dark:bg-gray-700 text-black dark:text-white hover:bg-gray-200 hover:dark:bg-gray-800" : "bg-black dark:bg-gray-200 text-white dark:text-black hover:bg-gray-800 hover:dark:bg-gray-400"}`}
                    onClick={async () => {
                        if (data?.data?.completed) await onInComplete(courseId);
                        else await onCompleted(courseId);
                    }}>
                    {(onCompletedLoading || onInCompleteLoading) ? <Loader className="h-5 w-5" text="Please wait..." col={isDarkMode ? "white" : "black"} /> : data?.data?.completed ? <div className="flex items-center gap-1">
                        <IoMdCheckmarkCircleOutline className="h-5 w-5" />
                        Completed
                    </div> : <p className="text-nowrap text-sm">
                        Mark as Completed
                    </p>}
                </button>
            </div>
            <div className="flex lg:flex-row flex-col items-start justify-between gap-5 mt-8 h-full lg:h-[60vh] w-full">
                <div className="shadow-xl p-3 rounded-b-xl border-r border-l border-b border-gray-200 dark:border-gray-700 flex-1 flex flex-col justify-center gap-2 w-full">
                    <div className="aspect-video rounded-md overflow-hidden">
                        <ReactPlayer
                            width={"100%"}
                            height={"100%"}
                            controls={true}
                            url={initialLecture?.lecture?.videoUrl}
                            onEnded={handleCourseProgressUpdate}
                        />
                    </div>
                    <h2 className="font-semibold text-lg">Lecture {initialLecture?.index}: {initialLecture?.lecture?.lectureTitle}</h2>
                </div>
                <div className="h-full w-full md:w-fit font-semibold border-l-0 md:border-l border-t md:border-t-0 md:pt-0 pt-3 md:pl-2 border-gray-300 dark:border-gray-700 overflow-y-scroll">
                    <h2 className="text-xl font-bold">Course Lectures</h2>
                    <div className="flex flex-col gap-2 mt-3">
                        {data?.data?.courseDetails?.lectures?.map((lecture, idx) =>
                            <div key={lecture._id} className={`cursor-pointer flex items-center gap-2 text-md border border-gray-200 dark:border-gray-700 p-4 rounded-md  ${initialLecture?.lecture?._id === lecture._id ? "bg-gray-300 dark:bg-gray-700" : "bg-white dark:bg-gray-800"}`}
                                onClick={() => {
                                    setInitialLecture(() => ({
                                        lecture: lecture,
                                        index: idx + 1,
                                    }));
                                }}>
                                {handleViewed(lecture._id) ?
                                    <div>
                                        <HiOutlineCheckCircle className="text-2xl sm:block hidden text-green-500" />
                                        <HiCheckCircle className="text-2xl sm:hidden block text-green-500" />
                                    </div>
                                    :
                                    <HiOutlinePlay className="text-2xl text-black dark:text-gray-400" />
                                }
                                <p className="flex-1 truncate w-[250px] text-lg line-clamp-2">
                                    {lecture.lectureTitle}
                                </p>
                                {handleViewed(lecture._id) && <span className={`bg-green-200 w-fit py-1 font-semibold sm:block hidden px-3 text-xs text-green-800 rounded-md `}>
                                    Completed
                                </span>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CourseProgress;