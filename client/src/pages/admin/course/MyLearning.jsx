import CourseItem from "../../../components/CourseItem";
import useAuth from "../../../utils/useAuth";

function MyLearning() {

    const { user } = useAuth();

    return (
        <div className="flex flex-col md:items-start items-center px-6 mx-auto mt-[60px] max-w-screen-xl w-full">
            <h1 className="font-bold md:text-2xl text-xl uppercase mt-5">My Learning</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mt-5 w-full">
                {user?.enrolledCourses?.length === 0 ? <p className="text-lg">You haven't enrolled to any course yet</p> : user?.enrolledCourses?.map((course) => (<CourseItem key={course._id} course={course} />))}
            </div>
        </div>
    )
}

export default MyLearning;