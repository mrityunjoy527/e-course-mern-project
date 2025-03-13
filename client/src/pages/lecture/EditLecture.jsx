import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import Switch from "../../components/Switch";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from 'axios';
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useCourse from "../../utils/useCourse";
import LoadingPage from "../../components/LoadingPage";
import { FiAlertCircle } from "react-icons/fi";
import Loader from "../../components/Loader";

const URL = "http://localhost:8080/api/media";

function EditLecture() {

  const queryClient = useQueryClient();
  const { register, handleSubmit, setValue } = useForm();
  const [isOn, setIsOn] = useState(false);
  const { courseId, lectureId } = useParams();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [showErrorTab, setErrorTab] = useState(false);
  const [uploadVideoInfo, setUploadVideoInfo] = useState({
    videoUrl: "",
    publicId: "",
  });
  const { getLecture, removeLecture, updateLecture } = useCourse();
  const navigate = useNavigate();

  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ['lecture', courseId, lectureId],
    queryFn: ({ queryKey }) => getLecture({ courseId: queryKey[1], lectureId: queryKey[2] }),
  });

  const { mutateAsync: onRemoveLecture, data: removeData, isLoading: removeLoading, isSuccess: removeSuccess, error: removeError } = useMutation({
    mutationFn: removeLecture,
  });

  const { mutateAsync: onUpdateLecture, data: updateData, isLoading: updateLoading, isSuccess: updateSuccess, error: updateError } = useMutation({
    mutationFn: updateLecture,
  });

  useEffect(() => {
    if (updateSuccess) {
      if (!updateData?.lecture) {
        toast.error(updateData?.message ?? "Something went wrong!", { id: 14 });
      }
      else {
        toast.success("Lecture updated", { id: 14 });
        queryClient.invalidateQueries(["lectures, lecture"]);
        navigate(`/admin/course/${courseId}/lecture`, { replace: true });
      }
    }
    if (updateError) {
      toast.error(updateError ?? "Something went wrong!", { id: 14 });
    }
  }, [updateSuccess, updateError]);

  useEffect(() => {
    if (removeSuccess) {
      if (!removeData?.isDeleted) {
        toast.error(removeData?.message ?? "Something went wrong!", { id: 13 });
      }
      else {
        toast.success("Lecture deleted", { id: 13 });
        queryClient.invalidateQueries(["lectures"]);
        navigate(`/admin/course/${courseId}/lecture`, { replace: true });
      }
    }
    if (removeError) {
      toast.error(removeError ?? "Something went wrong!", { id: 13 });
    }
  }, [removeSuccess, removeError]);

  useEffect(() => {
    if (isSuccess) {
      if (!data?.lecture) {
        toast.error(data?.message ?? "Something went wrong!", { id: 12 });
        setErrorTab(true);
      }
    }
    if (error) {
      toast.error(error, { id: 12 });
    }
  }, [isSuccess, error]);

  useEffect(() => {
    setValue("lectureTitle", data?.lecture?.lectureTitle);
    if (data?.lecture?.isPreviewFree) setIsOn(true);
  }, [data]);

  async function onSubmit({ lectureTitle }) {
    const lectureData = { lectureTitle, videoInfo: uploadVideoInfo, isPreviewFree: isOn };
    await onUpdateLecture({ lectureData, courseId, lectureId });
  }

  async function fileHandler(e) {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("videoFile", file);
      try {
        setMediaUploading(true);
        const res = await axios.post(`${URL}/upload-video`, formData, {
          onUploadProgress({ loaded, total }) {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
          withCredentials: true,
        });
        if (res.data.response) {
          setUploadVideoInfo({
            videoUrl: res.data.response.url,
            publicId: res.data.response.public_id,
          });
          toast.success(res.data.message);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Video upload failed");
      } finally {
        setMediaUploading(false);
      }
    }
  }

  if (showErrorTab) return <div className='flex h-[calc(100vh-60px-10rem)] w-full items-center justify-center'>
    <div className="flex flex-col gap-2 items-center md:relative justify-center">
      <FiAlertCircle className="text-red-600 w-14 h-14" />
      <h1 className="text-2xl font-bold">Lecture not found</h1>
      <p className="text-base">Sorry we couldn't find the lecture you are looking for</p>
    </div>
  </div>;

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="flex flex-col max-w-[50rem] gap-6 overflow-y-auto">
      <div className='flex items-center gap-4'>
        <Link
          to={`/admin/course/${courseId}/lecture`}
          className='font-semibold cursor-pointer rounded-full border p-2'>
          <FaArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">
          Update your lecture
        </h1>
      </div>
      <div className="border border-gray-100 shadow-lg rounded-xl md:py-8 md:px-6 px-4 py-5 flex flex-col gap-8">
        <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col">
            <h5 className="md:text-xl text-lg font-semibold">Edit Lecture</h5>
            <p className="md:text-lg text-base text-gray-500">Make changes and click save when you're done.</p>
          </div>
          <button disabled={removeLoading || updateLoading || mediaUploading} className="md:text-base text-sm rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-all text-nowrap duration-150 w-full sm:w-fit py-2 px-4 cursor-pointer disabled:bg-red-400 disabled:cursor-not-allowed"
            onClick={async () => {
              await onRemoveLecture(lectureId);
            }} >
            {removeLoading ? <Loader className="h-5 w-5" text="Please wait..." col="white" /> : "Delete Lecture"}
          </button>
        </div>
        <form
          className="md:text-lg text-base flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col">
            <label
              htmlFor="title"
              className="font-semibold">Title</label>
            <input
              {...register("lectureTitle")}
              type="text"
              id="title"
              placeholder="Ex. Introduction to web development"
              className="md:py-2 py-1 px-3 border rounded-md border-gray-300"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="videoFile"
              className="font-semibold after:content-['*'] after:text-red-600">Video</label>
            <input
              type="file"
              id="videoFile"
              accept="video/*"
              name="photo"
              className="w-full md:w-fit border border-gray-300 rounded-md px-3 md:py-2 py-1 file:bg-white file:border-none file:font-semibold file:underline file:cursor-pointer text-gray-500"
              onChange={fileHandler}
            />
            {mediaUploading && <>
              <div className="w-full h-2 bg-gray-300 mt-2 rounded overflow-hidden">
                <div style={{ width: `${uploadProgress}%` }} className={`bg-blue-500 h-full`}></div>
              </div>
              <p className="md:text-lg text-base">{uploadProgress}% uploaded</p>
            </>
            }
          </div>
          <div className="flex items-center gap-4">
            <Switch onChange={setIsOn} isOn={isOn} />
            <p className="font-semibold text-base">Is this video FREE ?</p>
          </div>
          <button disabled={mediaUploading || removeLoading || updateLoading} className="sm:w-fit w-full md:text-base text-sm font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-150 py-2 px-4 cursor-pointer rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed">
            {updateLoading ? <Loader className="h-5 w-5" text="Please wait..." col="white" /> : "Upload Lecture"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EditLecture;