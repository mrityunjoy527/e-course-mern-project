
function ProfileDialog({children, className, show, removeDialog}) {
    return (
        <div className="z-20" onClick={removeDialog}>
            <ul className={className} hidden={!show}>
                {...children}
            </ul>
        </div>
    )
}

export default ProfileDialog;