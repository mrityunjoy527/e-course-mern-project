
function Modal({ removeDialog, children }) {
    return (
        <div className="max-w-screen max-h-screen w-full h-full bg-black dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 absolute top-0 left-0 z-50 flex items-center justify-center px-3" onClick={removeDialog}>
            {children}
        </div>
    )
}

export default Modal;