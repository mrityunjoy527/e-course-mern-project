import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Homepage from "../pages/Homepage";
import AuthHere from "../pages/authentication/AuthHere";
import Profile from "../pages/Profile";
import Dashboard from "../pages/admin/Dashboard";
import Stats from "../pages/admin/Stats";
import CourseTable from "../pages/admin/CourseTable";
import AddCourse from "../pages/admin/course/AddCourse";
import EditCourse from "../pages/admin/course/EditCourse";
import AddLecture from "../pages/lecture/AddLecture";
import EditLecture from "../pages/lecture/EditLecture";
import CourseDetails from "../pages/admin/course/CourseDetails";
import CourseProgress from "../pages/admin/course/CourseProgress";
import SearchPage from "../pages/SearchPage";
import MyLearning from "../pages/admin/course/MyLearning";
import { AdminRoute, AuthenticatedRoute, CoursePurchasedRoute, InstructorRoute, LoggedInRoute } from "./Protect";
import TurnInstructor from "../pages/TurnInstructor";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Homepage />
            },
            {
                path: "/login",
                element: <LoggedInRoute>
                    <AuthHere action="login" />
                </LoggedInRoute>
            },
            {
                path: "/register",
                element: <LoggedInRoute>
                    <AuthHere action="register" />
                </LoggedInRoute>
            },
            {
                path: "/profile",
                element: <AuthenticatedRoute>
                    <Profile />
                </AuthenticatedRoute>
            },
            {
                path: "/profile/start-teaching",
                element: <AuthenticatedRoute>
                    <InstructorRoute>
                        <TurnInstructor />
                    </InstructorRoute>
                </AuthenticatedRoute>
            },
            {
                path: "/my-learning",
                element: <AuthenticatedRoute>
                    <MyLearning />
                </AuthenticatedRoute>
            },
            {
                path: "/course/search",
                element: <AuthenticatedRoute>
                    <SearchPage />
                </AuthenticatedRoute>
            },
            {
                path: "/course-detail/:courseId",
                element: <AuthenticatedRoute>
                    <CourseDetails />
                </AuthenticatedRoute>
            },
            {
                path: "/course-progress/:courseId",
                element: <AuthenticatedRoute>
                    <CoursePurchasedRoute>
                        <CourseProgress />
                    </CoursePurchasedRoute>
                </AuthenticatedRoute>
            },
            {
                path: "/admin",
                element: <AdminRoute>
                    <Dashboard />
                </AdminRoute>,
                children: [
                    {
                        path: "/admin",
                        element: <Stats />
                    },
                    {
                        path: "/admin/course",
                        element: <CourseTable />
                    },
                    {
                        path: "/admin/course/create",
                        element: <AddCourse />
                    },
                    {
                        path: "/admin/course/:courseId",
                        element: <EditCourse />
                    },
                    {
                        path: "/admin/course/:courseId/lecture",
                        element: <AddLecture />
                    },
                    {
                        path: "/admin/course/:courseId/lecture/:lectureId",
                        element: <EditLecture />
                    },
                ]
            },
        ],
    }
]);

export default router;