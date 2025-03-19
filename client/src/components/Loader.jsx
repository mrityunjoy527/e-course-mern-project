
function Loader({ col, className, text }) {
    return (
        <div className="flex justify-center items-center gap-2">
            <img className={`${className} animate-spin`} src={col === "black" ? "/spinner_black.svg" : "/spinner_white.svg"} alt="" />
            <p >{text}</p>
        </div>
    )
}

export default Loader;