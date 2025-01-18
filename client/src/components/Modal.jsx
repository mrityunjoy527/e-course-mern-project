
function Modal({ removeDialog, children }) {
    return (
        <div className="max-w-screen max-h-screen w-full h-full bg-black bg-opacity-80 absolute top-0 left-0 z-50 flex items-center justify-center" onClick={removeDialog}>
            {children}
        </div>
    )
}

export default Modal;