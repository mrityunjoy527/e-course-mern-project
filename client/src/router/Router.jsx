import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Homepage from "../pages/Homepage";
import AuthHere from "../pages/authentication/AuthHere";
import Profile from "../pages/Profile";
import AddCourse from "../pages/admin/course/AddCourse";

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
                path: "login",
                element: <AuthHere action="login" />
            },
            {
                path: "register",
                element: <AuthHere action="register" />
            },
            {
                path: "profile",
                element: <Profile />
            },
            {
                path: "course",
                element: <AddCourse />
            }
        ],
    }
]);

export default router;