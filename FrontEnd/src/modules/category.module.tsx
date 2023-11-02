
export default function Category(props: any) {
    return (
        <div className="category">
            <div className="title">
                {props.title}
            </div>
            <div className="labs">
                {props.labs.map((lab: any) => (
                    <div key={props.title + lab.name} className="lab">
                        <div className="name">
                            {lab.name}
                        </div>
                        {
                            lab.done ? (
                                <div className="done">
                                    Splnil
                                </div>
                            ): 
                            (
                                <div className="not-done">
                                    Nesplnil
                                </div>
                            )
                        }
                    </div>
                ))}
            </div>
        </div>
    )
}