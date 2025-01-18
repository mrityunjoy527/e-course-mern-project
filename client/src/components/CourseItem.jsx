
function CourseItem({ course }) {
    return (
        <div className="flex flex-col gap-3 lg:max-w-[18rem] w-full h-[18rem] rounded-xl shadow-lg overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300">
            <img className="h-1/2 object-cover" src={course.thumbnail} alt="" />
            <div className=" px-3 flex flex-col gap-3 items-start justify-start">
                <span className="text-lg font-bold truncate w-full">{course.title}</span>
                <div className="flex items-center justify-between w-full font-semibold">
                    <div className="flex items-center gap-3 text-base w-[60%]">
                        <img className="w-8 h-8 object-cover rounded-full" src={course.creator_image} alt="" />
                        <p className="text-sm truncate flex-1">{course.creator}</p>
                    </div>
                    <p className="text-end px-3 py-2 text-xs bg-blue-700 text-white rounded-full">{course.difficulty}</p>
                </div>
                <p className="text-lg font-semibold">₹{course.price}</p>
            </div>
        </div>
    )
}

export default CourseItem;