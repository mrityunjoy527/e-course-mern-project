import { useState } from "react";
import { RiExpandUpDownLine } from "react-icons/ri";

function Select({ children, text="Sort by" }) {

    const [open, setOpen] = useState(false);

    return (
        <div className="relative flex items-center justify-between gap-3 px-3 py-2 rounded-md outline outline-1 shadow-md cursor-default text-sm outline-gray-400 whitespace-nowrap w-[130px]" onClick={() => setOpen(p => !p)}
        >
            <p>{text === "low"? "Low to high": text === "high"? 'High to low': "Sort by"}</p>
            <RiExpandUpDownLine className="text-gray-400 text-sm" />
            <div hidden={!open} className="absolute top-10 left-0 rounded-md outline outline-1 outline-gray-300 shadow-md p-1 bg-white">
                {...children}
            </div>
        </div>
    )
}

export default Select;