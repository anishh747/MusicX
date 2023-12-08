function SingleMessage(props) {
    return(
        <>
        <div className="message">
            <p className="meta">{props.name} <span>{props.displayTime}</span></p>
            <p className="text">
                {props.message}
            </p>
        </div>
        </>
    );
}

export default SingleMessage;