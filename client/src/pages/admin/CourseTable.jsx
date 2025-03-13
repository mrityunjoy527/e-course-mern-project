import { useQuery } from "react-query";
import useCourse from "../../utils/useCourse";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import LoadingPage from "../../components/LoadingPage";

function CourseTable() {

    const { courses, resetCourse, getCreatorCourses } = useCourse();

    const { data, isLoading, isSuccess, error } = useQuery({
        queryKey: ["courses"],
        queryFn: getCreatorCourses,
    });

    useEffect(() => {
        resetCourse();
    }, [])


    useEffect(() => {
        if (isSuccess) {
            if (!data?.courses) toast.error(data?.message ?? "Something went wrong!", { id: 6 });
            else if (data?.courses?.length > 0) toast.dismiss(6);
            else toast(data?.message, { id: 6 });
        }
        if (error) toast.error("Something went wrong!", { id: 6 });
    }, [isSuccess, error]);

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <div className="flex flex-col w-full gap-4 overflow-y-auto overflow-x-hidden">
            <Link className="text-sm w-fit font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-150 py-2 px-4 cursor-pointer rounded-md" to='/admin/course/create'>
                Create Course
            </Link>
            <table className="w-full">
                <tbody>
                    <tr className="md:text-lg text-base text-gray-400 font-semibold">
                        <th className="text-start px-1 py-2 max-w-[70%] w-full" >Title</th>
                        <th className="text-start px-1 py-2" >Price</th>
                        <th className="text-start px-1 py-2">Status</th>
                        <th className="px-1 py-2 text-start">Action</th>
                    </tr>
                    {courses?.map(course => (
                        <tr key={course._id} className="md:text-lg text-base border-t border-gray-200">
                            <td className="px-1 py-3 font-semibold">{course?.courseTitle}</td>
                            <td className="px-1 py-3 font-medium">{course?.coursePrice ? "₹" + course?.coursePrice : "NA"}</td>
                            <td className="px-1 py-3">
                                <p className={`${course?.isPublished ? "bg-green-200" : "bg-yellow-200"} w-fit py-1 font-semibold md:px-3 px-2 text-sm text-green-800 rounded-md`}>{course?.isPublished ? "Published" : "Private"}</p>
                            </td>
                            <td className="px-1 py-3">
                                <Link className="text-sm font-semibold hover:bg-gray-100 transition-all duration-150 py-1 md:px-3 px-2 cursor-pointer border rounded-md" to={`/admin/course/${course._id}`}>
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {data?.courses && <p className="text-base text-gray-600 text-center mt-5">
                {data.courses.length > 0 ? "A list of your recent courses." : 'No courses created'}
            </p>}
        </div>
    )
}

export default CourseTable;