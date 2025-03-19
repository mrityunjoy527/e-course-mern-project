import { FiCheck } from "react-icons/fi";

function Option({ children, value, title = false, setText, checked }) {
    return (
        <p className={`flex items-center gap-3 px-2 py-1 dark:bg-gray-800 bg-white text-nowrap ${title ? "font-semibold cursor-text" : "cursor-default hover:bg-gray-200 hover:dark:bg-gray-900 rounded-md"}`} onClick={(e) => {
            if (!title) setText(value);
            else e.stopPropagation(value);
        }} >
            {...children}
            {checked && <FiCheck className="text-sm" />}
        </p>
    )
}

export default Option;