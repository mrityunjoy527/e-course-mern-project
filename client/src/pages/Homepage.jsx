import courses from "../assets/course";
import CourseItem from "../components/CourseItem";
import Hero from "../components/Hero";

function Homepage() {
    return (
        <div className="flex flex-col w-full z-10">
            <Hero />
            <section className="flex max-w-screen-xl w-full mx-auto flex-col relative mt-5 px-6">
                <h1 className="text-center font-bold text-3xl">Our Courses</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7 mt-10">
                {courses.map((course) => (<CourseItem key={course._id} course={course}/>))}
                </div>
            </section>
        </div>
    )
}

export default Homepage;