import { FiCheck } from "react-icons/fi";

function Option({ children, value, title = false, setText, checked }) {
    return (
        <p className={`flex items-center gap-3 px-2 py-1 text-nowrap ${title ? "font-semibold cursor-text" : "cursor-default hover:bg-gray-100"}`} onClick={(e) => {
            if (!title) setText(value);
            else e.stopPropagation(value);
        }} >
            {...children}
            {checked && <FiCheck className="text-sm" />}
        </p>
    )
}

export default Option;