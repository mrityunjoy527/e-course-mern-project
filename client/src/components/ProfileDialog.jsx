
function ProfileDialog({ children, className, show }) {
    return (
        <div className="z-20" >
            <ul className={className} hidden={!show} onClick={(e) => e.stopPropagation()}>
                {...children}
            </ul>
        </div>
    )
}

export default ProfileDialog;