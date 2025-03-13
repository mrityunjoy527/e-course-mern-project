
function Switch({ onChange, isOn }) {

    return (
        <div
            className={`md:w-14 w-12 cursor-pointer transition-colors duration-400 md:h-7 h-6 rounded-full ${isOn ? "bg-blue-200" : "bg-gray-300"} flex items-center`}
            onClick={() => onChange(!isOn)}>
            <div className={`md:h-7 h-6 shadow-lg md:w-7 w-6 transition-all duration-400 rounded-full ${isOn ? "bg-blue-500" : "bg-white"} ${isOn ? "md:ml-7 ml-6" : "ml-0"}`}>
            </div>
        </div>
    )
}

export default Switch;