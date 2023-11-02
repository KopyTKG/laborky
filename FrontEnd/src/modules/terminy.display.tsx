import Pill from "./pill.module";


export default function Pills(props :any) {
    return (
        <>
        <div className="w-max grid grid-cols-1 md:grid-cols-2 grid-flow-row  gap-2">
                    {props.data.map((termin: { id: any; }) => (
                        <Pill key={termin.id} owned={props.owned? true : false} {...termin}/>
                        ))}
                </div>
        </>
    )
}