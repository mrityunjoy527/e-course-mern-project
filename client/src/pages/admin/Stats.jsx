import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';
import usePurchase from '../../utils/usePurchase';
import { useQuery } from 'react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';
import LoadingPage from '../../components/LoadingPage';

function Stats() {

    const { getAllPurchasedCourses } = usePurchase();
    const { data, isLoading, isSuccess, error } = useQuery({
        queryKey: ["purchasedCourses"],
        queryFn: getAllPurchasedCourses,
    });

    useEffect(() => {
        if (isSuccess) {
            if (!data?.purchase) toast.error(data?.message);
        }
        if(error) {
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
        <div className='w-full h-full flex flex-col gap-6 items-end'>
            <Link className="text-sm w-fit text-white md:hidden flex bg-black hover:bg-gray-800 font-semibold items-center gap-2 transition-all duration-150 py-2 px-4 cursor-pointer rounded-lg" to='/admin/course'>
                <p>Go to Courses</p>
                <FaArrowRight className="w-4 h-4" />
            </Link>
            <div className="grid gap-6 grid-row-3 sm:grid-cols-2 w-full">
                <div className="flex flex-col gap-3 md:py-6 py-4 md:px-6 px-4 shadow-lg rounded-lg outline outline-[1px] outline-gray-200">
                    <h1 className="md:text-xl text-lg font-semibold">Total Sales</h1>
                    <p className="md:text-3xl text-2xl font-bold text-blue-600">{data?.purchase?.length}</p>
                </div>
                <div className="flex flex-col gap-3 md:py-6 py-4 md:px-6 px-4 shadow-lg rounded-lg outline outline-[1px] outline-gray-200">
                    <h1 className="md:text-xl text-lg font-semibold">Total Revenue</h1>
                    <p className="md:text-3xl text-2xl font-bold text-blue-600">₹{totalRevenue}</p>
                </div>
                <div className="flex flex-col gap-3 sm:col-span-2 md:py-6 py-4 md:px-6 px-4 shadow-lg rounded-lg outline outline-[1px] outline-gray-200">
                    <h1 className="md:text-xl text-lg font-semibold">Total Sales</h1>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={courseData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                            <XAxis
                                dataKey="name"
                                stroke="#6b7280"
                                angle={-30} // Rotated labels for better visibility
                                textAnchor="end"
                                interval={0} // Display all labels
                            />
                            <YAxis stroke="#6b7280" />
                            <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
                            <Line
                                type="monotone"
                                dataKey="price"
                                stroke="#4a90e2" // Changed color to a different shade of blue
                                strokeWidth={3}
                                dot={{ stroke: "#4a90e2", strokeWidth: 2 }} // Same color for the dot
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default Stats;