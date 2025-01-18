import { ToastContainer } from "react-toastify";

function LoadingPage() {
    return (
        <div className="bg-white max-h-screen h-full max-w-screen w-full flex items-center justify-center z-50 absolute top-0 left-0">
            <ToastContainer position="top-center"/>
        </div>
    )
}

export default LoadingPage;