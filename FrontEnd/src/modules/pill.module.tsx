import { Button } from "@nextui-org/react";

export default function Pill(props: any) {
  return (
    <div className="w-96 flex bg-gray-200 h-max px-5 py-5 rounded border border-black gap-2 border-2 flex-col">
      <div className="text-2xl font-bold">{props.title}</div>
      <div className="text-md">
        {props.start} - {props.end} {props.date} - {props.location}
      </div>
      <div className="grid grid-cols-2 width-96 gap-24">
        <div className="m-auto flex self-start">
        {props.taken} / {props.cap}

        </div>
        <div className=" flex self-end">
          {!props.owned ? (
            <Button color="success" isDisabled={!props.enabled}>
              Zapsat se
            </Button>
          ) : (
            <Button color="danger" isDisabled={!props.enabled}>
              Odepsat se
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
