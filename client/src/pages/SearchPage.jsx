import Select from "../components/Select";
import Option from "../components/Option";
import { useEffect, useMemo, useState } from "react";
import useCourse from "../utils/useCourse";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import { FiAlertCircle } from "react-icons/fi";
import toast from 'react-hot-toast';
import LoadingPage from '../components/LoadingPage';

const filters = [
    {
        name: "Software Development",
        id: "software-development",
    },
    {
        name: "Web Development",
        id: "web-development",
    },
    {
        name: "Frontend Development",
        id: "frontend-development",
    },
    {
        name: "Backend Development",
        id: "backend-development",
    },
    {
        name: "Fullstack Development",
        id: "fullstack-development",
    },
    {
        name: "Responsive Design",
        id: "responsive-design",
    },
    {
        name: "Web Performance Optimization",
        id: "web-performance",
    },
    {
        name: "Search Engine Optimization (SEO)",
        id: "seo",
    },
    {
        name: "CMS Development",
        id: "cms-development",
    },
    {
        name: "E-commerce Development",
        id: "ecommerce-development",
    },
    {
        name: "Progressive Web Apps (PWA)",
        id: "progressive-web-apps",
    },
    {
        name: "Single Page Applications (SPA)",
        id: "single-page-applications",
    },
    {
        name: "API Development",
        id: "api-development",
    },
    {
        name: "Web Security",
        id: "web-security",
    },
    {
        name: "Web Accessibility (A11y)",
        id: "web-accessibility",
    },
    {
        name: "UI/UX Design",
        id: "ui-ux-design",
    },
    {
        name: "Data Science",
        id: "data-science",
    },
    {
        name: "Machine Learning",
        id: "machine-learning",
    },
    {
        name: "Artificial Intelligence",
        id: "artificial-intelligence",
    },
    {
        name: "Cybersecurity",
        id: "cybersecurity",
    },
    {
        name: "Cloud Computing",
        id: "cloud-computing",
    },
    {
        name: "Network Engineering",
        id: "network-engineering",
    },
    {
        name: "Computer Architecture",
        id: "computer-architecture",
    },
    {
        name: "Embedded Systems",
        id: "embedded-systems",
    },
    {
        name: "Robotics",
        id: "robotics",
    },
    {
        name: "Blockchain",
        id: "blockchain",
    },
    {
        name: "Game Development",
        id: "game-development",
    },
    {
        name: "Big Data",
        id: "big-data",
    },
    {
        name: "DevOps",
        id: "devops",
    },
];

function SearchPage() {

    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const { getSearchedCourses } = useCourse();
    const [filterText, setFilterText] = useState("Sort by");
    const [selectedCategories, setSelectedCategories] = useState([]);

    const filterCategories = useMemo(() => {
        return [...selectedCategories];
    }, [selectedCategories]);

    function handleFilter(e, categoryId) {
        if (e.target.checked) {
            setSelectedCategories(prev => [...prev, categoryId]);
        } else {
            const filtered = selectedCategories.filter(c => c !== categoryId);
            setSelectedCategories([...filtered]);
        }
    }

    const { data, isLoading, isSuccess, error } = useQuery({
        queryKey: ['queryCourse', query, filterCategories, filterText],
        staleTime: Infinity,
        queryFn: ({ queryKey }) => getSearchedCourses({ searchQuery: queryKey[1], categories: queryKey[2], sortByPrice: queryKey[3] }),
    });


    useEffect(() => {
        if (isSuccess) {
            if (!data?.courses) toast.error(data?.message, { id: 1 });
            else toast.dismiss(1);
        }
        if (error) toast.error("Something went wrong!", { id: 1 });

    }, [isLoading, isSuccess, error]);

    if(isLoading) return <LoadingPage/>

    return (
        <div className="mt-[60px] max-w-screen-xl mx-auto px-3 pt-10">
            {query && filterCategories.length === 0 && <div className="flex flex-col items-start gap-1">
                <h4 className="text-2xl font-bold">{data?.courses?.length} results for "{query}"</h4>
                <p className="text-base">Showing results for
                    <span className=" font-bold italic text-blue-800">
                        {` ${query}`}
                    </span>
                </p>
            </div>}
            <div className="md:flex-row flex-col flex items-start gap-10 mt-5 w-full">
                <div className="flex flex-col items-start w-full md:w-fit ">
                    <div className="flex gap-5 items-center justify-between w-full md:w-fit">
                        <p className="text-xl font-medium">Filter options</p>
                        <Select text={filterText}>
                            <Option title={true}>Sort by price</Option>
                            <Option setText={setFilterText} value="low" checked={filterText === "low"}>Low to high</Option>
                            <Option setText={setFilterText} value="high" checked={filterText === "high"}>High to low</Option>
                        </Select>
                    </div>
                    <div className="h-[1px] w-full bg-gray-200 my-5">
                    </div>
                    <p className="text-lg font-bold uppercase">Category</p>
                    <div className="flex md:flex-col flex-row flex-wrap md:gap-1 gap-3 mt-2">
                        {filters.map((filter) => (<div key={filter.id} className="flex items-center gap-1 md:gap-2">
                            <input type="checkbox" id={filter.id} checked={selectedCategories.includes(filter.id)}
                                className="w-4 h-4 accent-black" onChange={(e) => handleFilter(e, filter.id)} />
                            <label htmlFor={filter.id} className="font-medium text-base">{filter.name}</label>
                        </div>))}
                    </div>
                </div>
                {isLoading ? <div className=""></div> : <div className="flex flex-col items-center flex-1 w-full">
                    {data?.courses?.length > 0 ? data?.courses.map((course) => (
                        <Link key={course._id} to={`/course-detail/${course._id}`} className="hover:shadow-md cursor-pointer flex md:flex-row flex-col items-start md:items-center w-full justify-between border-b-[1px] border-b-gray-200 py-4 gap-4 rounded-md">
                            <div className="flex md:flex-row flex-col md:items-center items-start gap-4 w-full">
                                <img className="aspect-video rounded-md h-[8rem] w-full md:w-auto object-cover"
                                    src={course?.courseThumbnail} alt=""
                                />
                                <div className="flex flex-col gap-2 flex-1 ">
                                    <h4 className="text-xl w-fit hover:underline font-bold line-clamp-1">{course?.courseTitle}</h4>
                                    <p className="text-sm line-clamp-2 ">{course?.subTitle}</p>
                                    <p className="text-sm line-clamp-2 ">{course?.category}</p>
                                    <p>
                                        Instructor: <span className="font-bold">{course?.creator?.username}</span>
                                    </p>
                                    <div className="py-1 px-3 font-semibold bg-black text-white w-fit text-xs rounded-md">
                                        {course?.courseLevel}
                                    </div>
                                </div>
                            </div>
                            <p className="font-bold text-xl">₹{course?.coursePrice} </p>
                        </Link>
                    )) : <div className="flex flex-col gap-2 items-center md:relative md:top-40 justify-center">
                        <FiAlertCircle className="text-red-600 w-14 h-14" />
                        <h1 className="text-2xl font-bold">Course not found</h1>
                        <p className="text-base">Sorry we couldn't find the course you are looking for</p>
                        <Link onClick={() => setSelectedCategories([])} to={`/course/search/?query`} className="text-blue-600 font-medium">
                            Browse all courses
                        </Link>
                    </div>
                    }
                </div>}
            </div>
        </div >
    )
}

export default SearchPage;