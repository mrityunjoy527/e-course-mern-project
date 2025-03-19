import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from "react-query";
import useCourse from "../../../utils/useCourse";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import Loader from '../../../components/Loader';

function AddCourse() {

    const { register, handleSubmit } = useForm();
    const { createCourse, addNewCourse } = useCourse();
    const { mutateAsync: onCreate, isLoading, isSuccess, error, data } = useMutation({
        mutationFn: createCourse,
    });
    const navigate = useNavigate();

    async function onSubmit(data) {
        await onCreate(data);
    }

    useEffect(() => {
        if (isSuccess) {
            if (!data?.course) toast.error(data.message ?? "Something went wrong!", { id: 9 });
            else {
                addNewCourse(data.course);
                navigate("/admin/course", { replace: true });
                toast.success(data.message, { id: 9 });
            }
        }
        if (error) toast.error(error, { id: 9 });
    }, [error, isSuccess, isLoading]);

    return (
        <div className="flex flex-col gap-4 w-full text-black dark:text-white">
            <div className="flex flex-col items-center sm:items-start">
                <h1 className="text-2xl font-bold sm:text-start text-center">Create courses that educate, motivate, and transform lives.</h1>
                <p className="text-base sm:text-start text-center">Your journey starts here. Build courses that matter.</p>
            </div>
            <form className="flex flex-col text-base md:text-lg gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col">
                    <label htmlFor="title" className="font-semibold">Title</label>
                    <input
                        {...register("courseTitle", { required: true })}
                        type="text" id="title" placeholder="Your course title..." className="shadow-sm md:py-2 py-1 px-3 rounded-md max-w-[45rem] w-full text-base focus:outline-2 outline-1 outline outline-gray-300 dark:outline-gray-600 bg-white dark:bg-gray-800 placeholder:dark:text-gray-400 focus:dark:outline-gray-400 focus:outline-black" />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="category" className="font-semibold">Category</label>
                    <select
                        {...register("category", { required: true })}
                        id="category" className="border border-gray-200 shadow-sm p-2 rounded-md sm:max-w-fit w-full checked:bg-red-400 text-base border-none focus:outline-2 outline-1 outline outline-gray-300 dark:outline-gray-600 bg-white dark:bg-gray-800 placeholder:dark:text-gray-400 focus:dark:outline-gray-400 focus:outline-black">
                        <option value="default">Choose a category</option>
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
                <div className="flex items-center sm:justify-start justify-center gap-4">
                    <Link to="/admin/course" className="md:text-base text-sm font-semibold hover:bg-gray-200 hover:dark:bg-gray-400 transition-all text-center text-black bg-white dark:bg-gray-200 duration-150 sm:w-fit w-full py-2 px-4 cursor-pointer outline outline-1 outline-gray-300 dark:outline-none rounded-md">
                        Back
                    </Link>
                    <button disabled={isLoading} type="submit" className="md:text-base text-sm font-semibold text-white sm:w-fit text-center bg-black dark:bg-gray-700 hover:bg-gray-800 hover:dark:bg-gray-800 w-full transition-all duration-150 py-2 px-4 cursor-pointer rounded-md disabled:bg-gray-600 disabled:cursor-not-allowed disabled:dark:bg-gray-500 ">
                        {isLoading ? <Loader className="h-5 w-5" text="Please wait..." col="white" /> : "Create"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddCourse;