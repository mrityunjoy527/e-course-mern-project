import { RiExpandUpDownLine } from "react-icons/ri";
import useSortDialog from "../utils/useSortDialog";

function Select({ children, text = "Sort by" }) {

    const { open, toggleDialog } = useSortDialog();

    return (
        <div className="relative flex items-center justify-between gap-3 px-3 py-2 rounded-md outline outline-1 shadow-md text-sm outline-gray-400 dark:outline-gray-700 whitespace-nowrap w-[130px] cursor-pointer dark:text-gray-200 text-black" onClick={(e) => {
            e.stopPropagation();
            toggleDialog();
        }}
        >
            <p>{text === "low" ? "Low to high" : text === "high" ? 'High to low' : "Sort by"}</p>
            <RiExpandUpDownLine className="text-gray-400 text-sm" />
            <div hidden={!open} className="absolute top-10 left-0 rounded-md outline outline-1 outline-gray-300 dark:outline-gray-700 shadow-md p-1 bg-white dark:bg-gray-800 w-full">
                {...children}
            </div>
        </div>
    )
}

export default Select;