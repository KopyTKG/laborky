import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Button, Divider } from "@nextui-org/react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";

export default function Pill(props: any) {
  return (
    <Card className="w-[25rem] h-max border border-black border-2 bg-gradient-to-tr ">
      <CardHeader>
        <div className="text-2xl font-bold">{props.title}</div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="text-md flex flex-col">
          <div className="flex flex-row justify-start gap-1 ">
            <ClockIcon className="w-6" />
            <div className="pt-1">
              {props.start}- {props.end}
            </div>
          </div>
          <div className="flex flex-row justify-start gap-1">
            <CalendarDaysIcon className="w-6" />
            <div className="pt-1">{props.date}</div>
          </div>
          <div className="flex flex-row justify-start gap-1">
            <MapPinIcon className="w-6" />
            <div className="pt-1">{props.location}</div>
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex justify-between width-full items-center">
        <div className="flex self-start gap-2 items-center">
          {props.taken} / {props.cap} <UserGroupIcon className="w-7" />
        </div>
        <div className=" flex self-end">
          {!props.owned ? (
            <Button className="border border-black" color={props.taken == props.cap ? "danger" : "success"} isDisabled={props.taken < props.cap? false : true}>
              {props.taken == props.cap ? "Obsazeno": "Zapsat se"}
            </Button>
          ) : (
            <Button className="border border-black" color="danger" isDisabled={!props.enabled}>
              Odepsat se
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
