import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function Hero() {

    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate();
    function handleSearch(e) {
        e.preventDefault();
        const search = searchInput.trim();
        if (search !== "") navigate(`/course/search?query=${searchInput}`);
        else toast("Please enter the topic");
    }

    return (
        <div className="flex flex-col gap-5 sm:py-14 px-3 py-10 items-center justify-end w-full from-indigo-500 dark:from-slate-700 to-indigo-600 dark:to-slate-800 bg-gradient-to-r mt-[60px]">
            <h2 className="text-white font-bold lg:text-4xl text-3xl text-center">Find the Best Courses for You</h2>
            <p className="text-gray-200 dark:text-gray-400 text-base text-center">Discover, Learn, and UpSkill with our wide range of courses</p>
            <form onSubmit={handleSearch} className="flex mt-3 items-center justify-center max-w-[35rem] w-full h-fit overflow-hidden shadow-lg rounded-full">
                <input type="text" name="type" id="type" className="flex-1 border-none outline-none rounded-l-full text-black dark:text-white py-2 px-6 text-sm bg-white dark:bg-slate-700 w-0" placeholder="Search Courses..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                <button className="text-white font-semibold bg-blue-600 dark:bg-indigo-700 py-2 px-6 rounded-r-full text-sm hover:bg-blue-700 dark:hover:bg-indigo-800 transition-all duration-100 w-fit">Search</button>
            </form>
            <Link to="/course/search?query" className="bg-white dark:bg-slate-800 text-indigo-600 dark:text-white font-semibold text-sm py-2 px-6 rounded-full border-none hover:bg-gray-200 dark:hover:bg-slate-900 transition-all duration-100">Explore Courses</Link>
        </div>
    );
}

export default Hero;