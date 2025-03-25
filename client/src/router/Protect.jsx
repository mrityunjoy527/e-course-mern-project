import { Navigate, useParams } from "react-router-dom";
import useAuth from "../utils/useAuth"
import { useQuery } from "react-query";
import usePurchase from "../utils/usePurchase";

export const AuthenticatedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace={true} />;
    return children;
}

export const LoggedInRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) return <Navigate to="/" replace={true} />;
    return children;
}

export const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    if (user?.role !== 'instructor') return <Navigate to="/" replace={true} />;
    return children;
}

export const InstructorRoute = ({ children }) => {
    const { user } = useAuth();
    if (user?.role === 'instructor') return <Navigate to="/profile" replace={true} />;
    return children;
}

export const CoursePurchasedRoute = ({ children }) => {
    const { courseId } = useParams();
    const { getCourseDetailsWithPurchaseStatus } = usePurchase();
    const { data, isLoading, isSuccess } = useQuery({
        queryKey: ["courseDetails"],
        queryFn: () => getCourseDetailsWithPurchaseStatus(courseId),
    });
    if (isLoading) {
        return <div className='flex h-full w-full items-center justify-center'>
            <img src='./loading.svg' className='w-15 h-15 animate-spin' />
        </div>
    }
    if (isSuccess) {
        if (!data.ok || data?.purchased) {
            return children;
        }
        else {
            return <Navigate to="/" replace={true} />;
        }
    }
    return <div></div>;
}