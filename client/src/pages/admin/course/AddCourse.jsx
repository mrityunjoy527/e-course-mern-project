function AddCourse() {
    return (
        <div className="flex flex-col mt-[60px] gap-4 py-10 px-20">
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold">Create courses that educate, motivate, and transform lives.</h1>
                <p className="text-base">Your journey starts here. Build courses that matter.</p>
            </div>
            <form className="flex flex-col text-lg gap-4">
                <div className="flex flex-col">
                    <label htmlFor="title" className="font-semibold">Title</label>
                    <input type="text" id="title" name="title" placeholder="Your course title..." className="border border-gray-200 shadow-sm p-2 rounded-md"/>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="category" className="font-semibold">Category</label>
                    <select name="category" id="category" className="border border-gray-200 shadow-sm p-2 rounded-md w-fit">
                        <option value="default">Select a category</option>
                        <option value="beginner">Beginner</option>
                        <option value="medium">Medium</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
            </form>
            <div className="flex items-center gap-4">
                <button className="text-base font-semibold hover:bg-gray-100 transition-all duration-150 py-2 px-4 cursor-pointer border rounded-md">Cancel</button>
                <button className="text-base font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-150 py-2 px-4 cursor-pointer rounded-md">Create</button>
            </div>
        </div>
    )
}

export default AddCourse;