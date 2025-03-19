import { useDarkModeContext } from "../utils/DarkModeContext";

function LoadingPage() {
    const { isDarkMode } = useDarkModeContext();

    return (
        <div className="bg-white dark:bg-gray-900 max-h-screen h-full max-w-screen w-full flex flex-col items-center justify-center z-50 absolute top-0 left-0">
            <img className="h-14 w-14 animate-spin" src={isDarkMode ? "/spinner_white.svg" : "/spinner_black.svg"} alt="" />
            <p className="font-semibold text-xl dark:text-white text-black">Please wait...</p>
        </div>
    )
}

export default LoadingPage;