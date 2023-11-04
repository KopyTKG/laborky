import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Button, Divider } from "@nextui-org/react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";

export default function Pill(props: any) {
  const studenti = (props.zapsany as string[]).length;

  function CheckDate(date: any) {
    let timeToCheck = new Date(date).setHours(new Date(date).getHours() - 24);
    if (new Date().getTime() < new Date(timeToCheck).getTime()) {
      return true;
    } else {
      return false;
    }

  }

  const VolnoRender: any = CheckDate(props.start)? (studenti < props.kapacita ? false : true) : true;
  const CapRender: any = CheckDate(props.start)? (studenti >= props.kapacita ? true : false) : true;

  return (
    <Card className="w-[25rem] h-max border bg-gradient-to-tr border-1 dark:border-gray-700 dark:from-black dark:to-gray-800 border-gray-900 from-teal-100 to-gray-100 ">
      <CardHeader>
        <div className="text-2xl font-bold">{`${props.predmet} Laboratorní cvičení ${props.cislo}`}</div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="text-md flex flex-col">
          <div className="flex flex-row justify-start gap-1 ">
            <ClockIcon className="w-6" />
            <div className="pt-1">
              {new Date(props.start).toLocaleTimeString()} -{" "}
              {new Date(props.end).toLocaleTimeString()}
            </div>
          </div>
          <div className="flex flex-row justify-start gap-1">
            <CalendarDaysIcon className="w-6" />
            <div className="pt-1">
              {new Date(props.end).toLocaleDateString()}
            </div>
          </div>
          <div className="flex flex-row justify-start gap-1">
            <MapPinIcon className="w-6" />
            <div className="pt-1">{props.location}</div>
          </div>
        </div>
      </CardBody>
      <CardFooter className="flex justify-between width-full items-center">
        <div className="flex self-start gap-2 items-center">
          {`${studenti} / ${props.kapacita}`} <UserGroupIcon className="w-7" />
        </div>
        <div className=" flex self-end">
          {!props.owned ? (
            <Button
              className="border border-black"
              color={CapRender ? "danger" : "success"}
              isDisabled={VolnoRender}
            >
              {studenti == props.cap ? "Obsazeno" : "Zapsat se"}
            </Button>
          ) : (
            <Button
              className="border border-black"
              color="danger"
              isDisabled={
                CheckDate(props.start)? false : true
              }
            >
              {CheckDate(props.start)? "Odepsat se" : "Nelze se odepsat"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
