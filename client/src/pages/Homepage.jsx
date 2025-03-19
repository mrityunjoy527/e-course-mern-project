import { useQuery } from "react-query";
import courses from "../assets/course";
import CourseItem from "../components/CourseItem";
import Hero from "../components/Hero";
import useCourse from "../utils/useCourse";
import { useEffect } from "react";
import toast from "react-hot-toast";

function Homepage() {

    const { getAllCourses } = useCourse();
    const { data, isLoading, isSuccess, error } = useQuery({
        queryKey: ["published-courses"],
        queryFn: getAllCourses,
    });

    useEffect(() => {
        if (isLoading) {
            toast.loading("Please wait...", { id: 16 });
        }
        if (isSuccess) {
            if (!data?.courses) toast.error(data?.message ?? "Something went wrong", { id: 16 });
            else {
                toast.dismiss(16);
            }
        }
        if (error) {
            toast.error(data?.message ?? "Something went wrong", { id: 16 });
        }
    }, [isLoading, isSuccess, error]);

    return (
        <div className="flex flex-col w-full z-10">
            <Hero />
            <section className="flex max-w-screen-xl w-full mx-auto flex-col relative mt-5 px-3">
                <h1 className="text-center dark:text-white text-black font-bold text-3xl">Our Courses</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mt-5">
                    {data?.courses?.map((course) => (<CourseItem key={course._id} course={course} />))}
                </div>
            </section>
        </div>
    )
}

export default Homepage;