import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { IoIosCheckbox } from "react-icons/io";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from 'react-query';
import useAuth from "../utils/useAuth";
import Loader from "../components/Loader";

const questions = [
    {
        question: "What is your reason for becoming an instructor?",
        one: "I have expertise in a subject and want to teach.",
        two: "I want to share my knowledge and earn money.",
        three: "I have prior teaching experience.",
    },
    {
        question: "Do you have any prior teaching experience?",
        one: "Yes, I have taught online/offline before.",
        two: "No, but I have knowledge in my field.",
        three: "No experience, but I am passionate about teaching.",
    },
    {
        question: "What type of courses do you plan to offer?",
        input: true,
    },
    {
        question: "Agreement & Platform Guidelines",
        one: "I agree to follow the platform’s content and quality guidelines.",
    },

];

function TurnInstructor() {

    const queryClient = useQueryClient();
    const [idx, setIdx] = useState(0);
    const [selected, setSelected] = useState(null);
    const navigate = useNavigate();
    const [answer, setAnswer] = useState("");
    const { makeInstructor } = useAuth();
    const [data, setData] = useState({
        questionOne: "",
        questionTwo: "",
        category: "",
        agreeToTerms: true,
    });
    const { mutateAsync, data: res, isLoading, isSuccess } = useMutation({
        mutationFn: makeInstructor
    })

    function handleOptionOne() {
        if (selected === 1) {
            setSelected(null);
            setAnswer("");
        }
        else {
            setSelected(1);
            setAnswer(questions[idx].one);
        }
    }

    function handleOptionTwo() {
        if (selected === 2) {
            setSelected(null);
            setAnswer("");
        }
        else {
            setSelected(2);
            setAnswer(questions[idx].two);
        }
    }

    function handleOptionThree() {
        if (selected === 3) {
            setSelected(null);
            setAnswer("");
        }
        else {
            setSelected(3);
            setAnswer(questions[idx].three);
        }
    }

    useEffect(() => {
        if (isSuccess) {
            if (!res?.ok) {
                toast.error(res?.message ?? "Something went wrong!", { id: 1 });
            }
            else {
                queryClient.invalidateQueries(["user"]);
                navigate("/profile");
                toast.success("You are now an Instructor", { id: 1 });
            }
        }
    }, [isSuccess]);

    async function handleNext() {
        if (idx === 3) {
            if (!selected) {
                toast("You must agree to our guidelines", { id: 1 });
            } else {
                await mutateAsync(data);
            }
        } else {
            if (questions[idx].input && !answer) {
                toast("You must write the category", { id: 1 });
            }
            else if (!questions[idx].input && !selected) {
                toast("You must select any one option", { id: 1 });
            }
            else {
                switch (idx) {
                    case 0: setData(prev => ({ ...prev, questionOne: answer }));
                        break;
                    case 1: setData(prev => ({ ...prev, questionTwo: answer }));
                        break;
                    default: setData(prev => ({ ...prev, category: answer.trim() }));
                }
                setIdx(prev => prev + 1);
                setSelected(null);
                setAnswer("");
            }
        }
    }

    return (
        <div className="flex flex-col md:items-start items-center px-3 py-10 mx-auto mt-[60px] max-w-screen-xl w-full dark:text-white text-black relative h-[calc(100vh-60px)]">
            <img className="absolute right-0 bottom-0 p-2 max-h-[30rem] z-1" src="/teacher.png" alt="" />
            <div className="z-10 dark:text-white text-black w-full">
                <div className="flex flex-col-reverse md:flex-row md:items-center items-start justify-between gap-5">
                    <h1 className="md:text-3xl text-2xl font-bold flex items-center gap-2">
                        {idx === 0 && "1️⃣"}
                        {idx === 1 && "2️⃣"}
                        {idx === 2 && "3️⃣"}
                        {questions[idx].question}
                    </h1>
                    <button disabled={isLoading} onClick={handleNext} className="py-2 px-4 bg-indigo-600 text-white font-semibold text-sm w-fit rounded-lg md:text-base text-nowrap hover:bg-indigo-500 transition-all text-center duration-150 sm:w-fit shadow-md cursor-pointer self-end disabled:cursor-not-allowed disabled:bg-indigo-300">
                        {idx === 3 ? isLoading ? <Loader className="h-5 w-5" text="Please wait..." col="white" /> : "Submit" : "Next"}
                    </button>
                </div>
                <div className="md:ml-2 mt-5 w-full flex flex-col">
                    {questions[idx].one && <p className={`flex items-center gap-2 md:text-xl text-lg cursor-pointer mt-3 w-full ${!questions[idx].two ? "text-indigo-600" : ""}`} onClick={handleOptionOne}>
                        {selected === 1 ? <IoIosCheckbox className="shrink-0 w-6 h-6 dark:text-green-500 text-indigo-600" /> : <MdOutlineCheckBoxOutlineBlank className="shrink-0 w-6 h-6" />}
                        {questions[idx].one}
                    </p>}
                    {questions[idx].two && <p className="flex items-center gap-2 md:text-xl cursor-pointer text-lg mt-3" onClick={handleOptionTwo}>
                        {selected === 2 ? <IoIosCheckbox className="shrink-0 w-6 h-6 dark:text-green-500 text-indigo-600" /> : <MdOutlineCheckBoxOutlineBlank className="shrink-0 w-6 h-6" />}
                        {questions[idx].two}
                    </p>}
                    {questions[idx].three && <p className="flex items-center gap-2 md:text-xl cursor-pointer text-lg mt-3" onClick={handleOptionThree}>
                        {selected === 3 ? <IoIosCheckbox className="shrink-0 w-6 h-6 dark:text-green-500 text-indigo-600" /> : <MdOutlineCheckBoxOutlineBlank className="shrink-0 w-6 h-6" />}
                        {questions[idx].three}
                    </p>}
                    {questions[idx].input && <input
                        type="category"
                        name="category"
                        id="category"
                        autoComplete="true"
                        placeholder="Enter category..."
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="py-2 px-3 max-w-[45rem] text-base border-none focus:outline-2 outline-1 outline rounded-md outline-gray-300 dark:outline-gray-600 bg-white dark:bg-gray-800 placeholder:dark:text-gray-400 focus:dark:outline-gray-400 focus:outline-black"
                    />}
                </div>
            </div>
        </div>
    )
}

export default TurnInstructor;