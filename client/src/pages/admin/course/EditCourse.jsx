import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useCourse from '../../../utils/useCourse';
import compressImage from '../../../utils/useCompress';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import LoadingPage from '../../../components/LoadingPage';
import { FiAlertCircle } from 'react-icons/fi';
import Loader from '../../../components/Loader';


function EditCourse() {

    const queryClient = useQueryClient();
    const { register, handleSubmit, setValue, watch } = useForm('');
    const [thumbnail, setThumbnail] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState();
    const [showErrorTab, setShowErrorTab] = useState(false);
    const { courseId } = useParams();
    const { getCourseById, updateCourse, togglePublishCourse, removeCourse } = useCourse();
    const navigate = useNavigate();
    const { data: queryData, isLoading: queryLoading, isSuccess: querySuccess, error: queryError } = useQuery({
        queryKey: ['course', courseId, "courses", "lectures"],
        queryFn: ({ queryKey }) => getCourseById(queryKey[1])
    });

    const { data: removeData, mutateAsync: onRemove, isLoading: removeLoading, isSuccess: removeSuccess, error: removeError } = useMutation({
        mutationFn: removeCourse,
    });

    const { data: mutationData, mutateAsync: onUpdate, isLoading: mutationLoading, isSuccess: mutationSuccess, error: mutationError } = useMutation({
        mutationFn: updateCourse,
    });

    const course = queryData?.course;

    const { data: publishData, mutateAsync: onTogglePublish, isLoading: publishLoading, isSuccess: publishSuccess, error: publishError } = useMutation({
        mutationFn: togglePublishCourse,
    });

    useEffect(() => {
        if (publishSuccess) {
            if (!publishData?.course) {
                toast.error(publishData?.message ?? "Something went wrong!", { id: 15 });
            }
            else {
                queryClient.invalidateQueries(["course"]);
                toast.success("Course published", { id: 15 });
            }
        }
        if (publishError) {
            toast.error(publishError ?? "Something went wrong!", { id: 15 });
        }
    }, [publishSuccess, publishError]);

    function fileHandler(e) {
        const file = e.target.files?.[0];
        if (file) {
            setThumbnailFile(file);
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onloadend = () => setThumbnail(fileReader.result);
        }
    }

    async function onSubmit(data) {
        const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = data;
        if (category === "default") {
            toast("Please select Category", { icon: "⚠" });
            return;
        }
        if (courseLevel === "default") {
            toast("Please select Course level", { icon: "⚠" });
            return;
        }
        const formData = new FormData();
        formData.append("title", courseTitle);
        formData.append("subTitle", subTitle);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("courseLevel", courseLevel);
        formData.append("coursePrice", coursePrice);
        if (thumbnailFile) {
            const compressedThumbnail = await compressImage(thumbnailFile);
            formData.append("courseThumbnail", compressedThumbnail);
        }
        await onUpdate({ formData, courseId });
    }


    useEffect(() => {
        register("description");
    }, []);

    const description = watch("description");

    useEffect(() => {
        if (querySuccess) {
            if (!queryData?.course) {
                toast.error(queryData?.message, { id: 7 });
                setShowErrorTab(true);
            }
        }
        if (queryError) {
            toast.error("Something went wrong!", { id: 7 });
        }
    }, [querySuccess, queryError]);

    useEffect(() => {
        if (mutationSuccess) {
            if (!mutationData?.course) toast.error(mutationData?.message, { id: 8 });
            else {
                queryClient.invalidateQueries(["courses"]);
                navigate("/admin/course", { replace: true });
                toast.success(mutationData?.message, { id: 8 });
            }
        }
        if (mutationError) {
            toast.error("Something went wrong!", { id: 8 });
        }
    }, [mutationLoading, mutationSuccess, mutationError]);

    useEffect(() => {
        setValue("courseTitle", course?.courseTitle);
        setValue("subTitle", course?.subTitle ?? "");
        setValue("description", course?.description ?? "");
        setValue("category", course?.category || "default");
        setValue("courseLevel", course?.courseLevel || "default");
        setValue("coursePrice", course?.coursePrice ?? "");
        setThumbnail(course?.courseThumbnail);
    }, [course]);

    async function handleTogglePublish(action) {
        await onTogglePublish({ courseId, query: action });
    }

    useEffect(() => {
        if (removeSuccess) {
            if (!removeData?.ok) {
                toast.error(removeData?.message, { id: 7 });
            } else {
                navigate("/admin/course", { replace: true });
                toast.success(removeData?.message, { id: 7 });
            }
        }
        if (removeError) {
            toast.error("Something went wrong!", { id: 7 });
        }
    }, [removeSuccess, removeError]);

    async function handleRemove() {
        await onRemove(courseId);
    }

    if (queryLoading) {
        return <LoadingPage />;
    }

    if (showErrorTab) return <div className='flex h-[calc(100vh-60px-10rem)] w-full items-center justify-center'>
        <div className="flex flex-col gap-2 items-center md:relative justify-center">
            <FiAlertCircle className="text-red-600 w-14 h-14" />
            <h1 className="text-2xl font-bold">Course not found</h1>
            <p className="text-base">Sorry we couldn't find the course you are looking for</p>
        </div>
    </div>;

    return (
        <div className="flex flex-col w-full gap-6">
            <div className='flex items-center justify-end md:justify-between gap-1'>
                <h1
                    className="hidden md:block font-bold text-2xl">
                    Add detailed information regarding course
                </h1>
                <Link
                    to={`/admin/course/${courseId}/lecture`}
                    className='text-lg text-nowrap font-semibold cursor-pointer text-blue-600'>
                    Go to lectures
                </Link>
            </div>
            <div className="border border-gray-100 shadow-lg rounded-xl md:py-8 md:px-6 px-4 py-5 flex flex-col gap-8">
                <div className="flex flex-col-reverse md:flex-row md:items-center gap-5 justify-between">
                    <div className="flex flex-col">
                        <h5 className="md:text-xl text-lg font-semibold">Basic Information</h5>
                        <p className="md:text-lg text-base text-gray-500">
                            Make changes to your courses here. Click save when you're done.
                        </p>
                    </div>
                    <div className="flex items-center md:justify-center sm:justify-between justify-center gap-3">
                        <button disabled={course?.lectures?.length === 0 || mutationLoading || publishLoading || removeLoading} className="md:text-base text-sm rounded-lg font-semibold hover:bg-gray-100 transition-all w-full duration-150 py-2 px-4 cursor-pointer border disabled:bg-gray-300 text-nowrap disabled:cursor-not-allowed" onClick={() =>
                            handleTogglePublish(course.isPublished ? "false" : "true")}>
                            {publishLoading ? <Loader className="h-5 w-5" text="Please wait..." col="black" /> : course?.isPublished ? "Unpublish" : "Publish"}
                        </button>
                        <button disabled={mutationLoading || publishLoading || removeLoading} className="md:text-base text-sm rounded-lg font-semibold text-white bg-black hover:bg-gray-800 text-nowrap w-full transition-all duration-150 py-2 px-4 cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed" onClick={handleRemove}>
                            {removeLoading ? <Loader className="h-5 w-5" text="Please wait..." col="white" /> : "Remove Course"}
                        </button>
                    </div>
                </div>
                <form className="md:text-lg text-base flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col">
                        <label
                            htmlFor="title"
                            className="font-semibold">Title</label>
                        <input
                            {...register("courseTitle")}
                            type="text"
                            id="title"
                            placeholder="Ex. Fullstack development"
                            className="md:py-2 px-3 py-1 border rounded-md border-gray-300"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label
                            htmlFor="subTitle"
                            className="font-semibold">Subtitle</label>
                        <input
                            {...register("subTitle")}
                            type="text"
                            id="subTitle"
                            placeholder="Ex. Fullstack development course from zero to hero."
                            className="md:py-2 px-3 py-1 border rounded-md border-gray-300"
                        />
                    </div>
                    <div className='flex flex-col mb-3 overflow-hidden'>
                        <label htmlFor="description" className='font-semibold'>Description</label>
                        <ReactQuill
                            theme="snow"
                            value={description}
                            onChange={(content) => setValue("description", content)}
                            className='border-b border-gray-300'
                        />
                    </div>
                    <div className='flex sm:flex-row flex-col items-center flex-wrap gap-4'>
                        <div className='flex flex-col w-full sm:w-fit'>
                            <label htmlFor="category" className="font-semibold">Category</label>
                            <select
                                {...register("category")}
                                id="category" className="border border-gray-200 shadow-sm md:py-2 px-3 py-1 rounded-md">
                                <option value="default">Select a category</option>
                                <option value="software-development">Software Development</option>
                                <option value="web-development">Web Development</option>
                                <option value="frontend-development">Frontend Development</option>
                                <option value="backend-development">Backend Development</option>
                                <option value="fullstack-development">Fullstack Development</option>
                                <option value="responsive-design">Responsive Design</option>
                                <option value="web-performance">Web Performance Optimization</option>
                                <option value="seo">Search Engine Optimization (SEO)</option>
                                <option value="cms-development">CMS Development</option>
                                <option value="ecommerce-development">E-commerce Development</option>
                                <option value="progressive-web-apps">Progressive Web Apps (PWA)</option>
                                <option value="single-page-applications">Single Page Applications (SPA)</option>
                                <option value="api-development">API Development</option>
                                <option value="web-security">Web Security</option>
                                <option value="web-accessibility">Web Accessibility (A11y)</option>
                                <option value="ui-ux-design">UI/UX Design</option>
                                <option value="data-science">Data Science</option>
                                <option value="machine-learning">Machine Learning</option>
                                <option value="artificial-intelligence">Artificial Intelligence</option>
                                <option value="cybersecurity">Cybersecurity</option>
                                <option value="cloud-computing">Cloud Computing</option>
                                <option value="network-engineering">Network Engineering</option>
                                <option value="computer-architecture">Computer Architecture</option>
                                <option value="embedded-systems">Embedded Systems</option>
                                <option value="robotics">Robotics</option>
                                <option value="blockchain">Blockchain</option>
                                <option value="game-development">Game Development</option>
                                <option value="big-data">Big Data</option>
                                <option value="devops">DevOps</option>
                            </select>
                        </div>
                        <div className='flex flex-col w-full sm:w-fit'>
                            <label htmlFor="courseLevel" className="font-semibold">Course Level</label>
                            <select
                                {...register("courseLevel")}
                                id="courseLevel" className="border border-gray-200 shadow-sm md:py-2 px-3 py-1 rounded-md">
                                <option value="default">Select a course level</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Medium">Medium</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                        <div className='flex flex-col w-full sm:w-fit'>
                            <label htmlFor="price" className='font-semibold'>Price in (INR)</label>
                            <input
                                {...register("coursePrice")}
                                type="number" id='price' className="md:py-2 px-3 py-1 border rounded-md border-gray-300 " placeholder='399' />
                        </div>
                    </div>
                    <div className="flex flex-col sm:w-fit w-full">
                        <p className="font-semibold cursor-default">Course Thumbnail</p>
                        {thumbnail && <img src={thumbnail} alt="" className='mb-2 object-cover w-[18rem] h-[9rem] rounded-lg' />}
                        <input type="file" id="photo" accept="image/*" name="photo" className="sm:w-[18rem] border border-gray-300 rounded-md md:py-2 px-3 py-1 file:bg-white file:border-none file:font-semibold file:underline file:cursor-pointer text-gray-500 w-full" onChange={fileHandler} />
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/admin/course" className="md:text-base text-sm font-semibold hover:bg-gray-100 transition-all duration-150 py-2 px-4 cursor-pointer border rounded-md">Cancel</Link>
                        <button disabled={mutationLoading || publishLoading || removeLoading} className="md:text-base text-sm font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-150 py-2 px-4 cursor-pointer rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed">
                            {mutationLoading ? <Loader className="h-5 w-5" text="Please wait..." col="white" /> : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditCourse;