import { LuBadgeInfo } from "react-icons/lu";
import { HiOutlinePlay } from "react-icons/hi";
import usePurchase from "../../../utils/usePurchase";
import { useMutation, useQuery } from 'react-query';
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import ReactPlayer from 'react-player';
import { FiAlertCircle } from "react-icons/fi";
import LoadingPage from "../../../components/LoadingPage";
import Loader from "../../../components/Loader";

function CourseDetails() {

  const { createCheckoutSession, getCourseDetailsWithPurchaseStatus } = usePurchase();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [showErrorTab, setShowErrorTab] = useState(false);

  const { data: queryData, isSuccess: querySuccess, isLoading: queryLoading, error: queryError } = useQuery({
    queryKey: ["courseDetails", courseId],
    queryFn: ({ queryKey }) => getCourseDetailsWithPurchaseStatus(queryKey[1]),
  });

  const course = queryData?.course;

  const { data, mutateAsync: onCreateCheckoutSession, isSuccess, isLoading, error } = useMutation({
    mutationFn: createCheckoutSession,
  });

  useEffect(() => {
    if (isSuccess) {
      if (!data?.url) toast.error(data?.message ?? "Failed to checkout", { id: 6 });
      else {
        window.location.href = data.url;
      }
    }
    if (error) {
      toast.error("Something went wrong!", { id: 6 });
    }
  }, [isLoading, isSuccess, error]);

  useEffect(() => {
    if (querySuccess) {
      if (!queryData?.course) {
        toast.error(queryData?.message, { id: 7 });
        setShowErrorTab(true);
      }
      else {
        toast.dismiss(7);
      }
    }
    if (queryError) {
      toast.error("Something went wrong!", { id: 7 });
    }
  }, [querySuccess, queryError]);

  async function handleButton() {
    if (!queryData?.purchased) await onCreateCheckoutSession(courseId);
    else navigate(`/course-progress/${courseId}`);
  }

  if (queryLoading) {
    return <LoadingPage />;
  }

  if (showErrorTab) return <div className='flex mt-[60px] h-[calc(100vh-60px)] w-full items-center justify-center'>
    <div className="flex flex-col gap-2 items-center md:relative justify-center">
      <FiAlertCircle className="text-red-600 w-14 h-14" />
      <h1 className="text-2xl font-bold">Course not found</h1>
      <p className="text-base">Sorry we couldn't find the course you are looking for</p>
    </div>
  </div>;

  return (
    <div className="mt-[60px] ">
      <div className="bg-zinc-800">
        <div className="max-w-screen-xl mx-auto flex flex-col gap-2 text-white py-10 px-3">
          <h1 className="md:text-3xl text-2xl font-extrabold">{course?.courseTitle}</h1>
          <h3 className="font-semibold md:text-xl text-lg">{course?.subTitle}</h3>
          <p className="md:text-lg text-base">Created By <span className="underline italic text-blue-600 cursor-pointer">{course?.creator?.username}</span></p>
          <div className="flex items-center gap-2 md:text-lg text-base">
            <LuBadgeInfo className="w-5 h-5" />
            <p>Last updated {course?.createdAt.split("T")[0]}</p>
          </div>
          <p className="md:text-lg text-base">Students enrolled: {course?.enrolledStudents?.length}</p>
        </div>
      </div>
      <div className="flex md:flex-row flex-col items-start max-w-screen-xl mx-auto mt-5 md:gap-10 gap-5 px-3">
        <div className="flex flex-col md:flex-1 gap-3">
          <h1 className="md:text-2xl text-xl font-bold">Description</h1>
          <p className="md:text-base text-sm" dangerouslySetInnerHTML={{ __html: course?.description }} />
          <div className="shadow-xl text-lg flex flex-col gap-5 md:py-5 md:px-7 px-5 py-3 rounded-xl border border-gray-200">
            <div>
              <h4 className="font-bold md:text-2xl text-xl">Course Content</h4>
              <p className="text-gray-500 text-base">{course?.lectures?.length} lectures</p>
            </div>
            <div className="flex flex-col gap-3">
              {course?.lectures?.map((lecture) => (<p key={lecture._id} className="flex items-center gap-2 line-clamp-1 md:text-lg text-base">
                <span>
                  <HiOutlinePlay />
                </span>
                {lecture?.lectureTitle}
              </p>))}
            </div>
          </div>
        </div>
        <div className="md:flex-1 flex md:justify-end justify-center w-full">
          <div className="shadow-xl text-xl px-3 pt-3 pb-4 rounded-xl border border-gray-200 w-full">
            {/* <p>React player video ayga</p> */}
            <div className="aspect-video rounded-md overflow-hidden">
              <ReactPlayer
                width={"100%"}
                height={"100%"}
                controls={true}
                url={course?.lectures?.[0]?.videoUrl}
              />
            </div>
            <p className="text-xl mt-2 font-medium">{course?.lectures?.[0]?.lectureTitle}</p>
            <div className="h-[1px] mt-2 w-full border border-gray-200"></div>
            <p className="mt-2 text-xl font-semibold">₹{course?.coursePrice}</p>
            <button onClick={handleButton} disabled={isLoading} className="sm:text-lg text-base mt-8 rounded-lg font-semibold text-white bg-black hover:bg-gray-800 disabled:bg-gray-600 transition-all duration-150 py-2 px-4 cursor-pointer w-full disabled:cursor-not-allowed">
              {queryData?.purchased ? "Continue Course" :
                isLoading ?
                  <Loader className="h-5 w-5" text="Please wait..." col="white" /> :
                  "Purchase Course"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetails;