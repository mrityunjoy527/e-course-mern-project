import Loader from "./Loader";

function LoadingPage() {
    return (
        <div className="bg-white max-h-screen h-full max-w-screen w-full flex flex-col items-center justify-center z-50 absolute top-0 left-0">
            <img className="h-14 w-14 animate-spin" src="/spinner_black.svg" alt="" />
            <p className="font-semibold text-xl">Please wait...</p>
        </div>
    )
}

export default LoadingPage;