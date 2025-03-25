import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import usePurchase from '../../utils/usePurchase';
import { useQuery } from 'react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';
import LoadingPage from '../../components/LoadingPage';
import { useDarkModeContext } from '../../utils/DarkModeContext';

function Stats() {

    const { getAllPurchasedCourses } = usePurchase();
    const { isDarkMode } = useDarkModeContext();
    const { data, isLoading, isSuccess, error } = useQuery({
        queryKey: ["purchasedCourses"],
        queryFn: getAllPurchasedCourses,
    });

    useEffect(() => {
        if (isSuccess) {
            if (!data?.purchase) toast.error(data?.message);
        }
        if (error) {
            toast.error("Something went wrong!");
        }
    }, [isSuccess, error]);

    if (isLoading) {
        return <LoadingPage />;
    }

    const courseData = data?.purchase?.map((course) => ({
        name: course?.courseId?.courseTitle,
        price: course?.courseId?.coursePrice,
    }));

    const totalRevenue = data?.purchase?.reduce((acc, element) => acc + element.amount, 0);

    return (
        <div className='w-full h-full flex flex-col gap-6 items-end text-black dark:text-white'>
            <Link className="text-sm w-fit text-white md:hidden flex bg-black dark:bg-gray-700 hover:bg-gray-800 hover:dark:bg-gray-800 font-semibold items-center gap-2 transition-all duration-150 py-2 px-4 cursor-pointer rounded-lg" to='/admin/course'>
                <p>Go to Courses</p>
                <FaArrowRight className="w-4 h-4" />
            </Link>
            <div className="grid gap-6 grid-row-3 sm:grid-cols-2 w-full">
                <div className="flex flex-col gap-3 md:py-6 py-4 md:px-6 px-4 shadow-lg rounded-lg outline outline-[1px] outline-gray-200 dark:outline-gray-700">
                    <h1 className="md:text-xl text-lg font-semibold">Total Sales</h1>
                    <p className="md:text-3xl text-2xl font-bold text-blue-600 dark:text-blue-500">{data?.purchase?.length ?? 0}</p>
                </div>
                <div className="flex flex-col gap-3 md:py-6 py-4 md:px-6 px-4 shadow-lg rounded-lg outline outline-[1px] outline-gray-200 dark:outline-gray-700">
                    <h1 className="md:text-xl text-lg font-semibold">Total Revenue</h1>
                    <p className="md:text-3xl text-2xl font-bold text-blue-600 dark:text-blue-500">₹{totalRevenue ?? 0}</p>
                </div>
                <div className="flex flex-col gap-3 sm:col-span-2 md:py-6 py-4 md:px-6 px-4 shadow-lg rounded-lg outline outline-[1px] outline-gray-200 dark:outline-gray-700">
                    <h1 className="md:text-xl text-lg font-semibold">Total Sales</h1>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={courseData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#fff" : "#7b7f87"} />
                            <XAxis
                                dataKey="name"
                                stroke={isDarkMode ? "#fff" : "#6b7280"}
                                angle={-30} // Rotated labels for better visibility
                                textAnchor="end"
                                interval={0} // Display all labels
                            />
                            <YAxis stroke={isDarkMode ? "#fff" : "#6b7280"} />
                            <Tooltip contentStyle={{ backgroundColor: isDarkMode ? "#1F2937" : '#f0f0f0f0', borderRadius: '5px', borderColor: isDarkMode ? "#6b7280" : "#D1D5DB" }} formatter={(value, name) => [`₹${value}`, name]} />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke={isDarkMode ? "#3B82F6" : "#2563EB"} // Changed color to a different shade of blue
                                strokeWidth={3}
                                dot={{ stroke: isDarkMode ? "#3B82F6" : "#2563EB", strokeWidth: 2 }} // Same color for the dot
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default Stats;