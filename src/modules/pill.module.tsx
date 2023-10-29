
export default function Pill(props: any) {
    return (
        <div className="pill">
            <div className="pill-main">
                <div className="title">
                    {props.title}
                </div>
                {!props.owned? (

                    
                    <div className={props.enabled? "button active" : "button inactive"}>
                    Zapsat se
                    </div>
                    ) :
                    (
                    <div className={props.enabled? "button active-red" : "button inactive-red"}>
                    Odepsat se
                    </div>
    
                    )
                }
            </div>
            <div className="pill-details">
                <div className="datetime">
                    {props.start} - {props.end} {props.date} - {props.location}
                </div>
                <div className="capacity">
                    {props.taken} / {props.cap}
                </div>
            </div>
        </div>
    )
}