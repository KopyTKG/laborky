import { Moje } from "@/data/terminy";
import Pill from "@/modules/pill.module";
import Pills from "@/modules/terminy.display";

export default function MojeTerminyPage() {
  return (
    <main className="h-screen">
      <div className="w-full flex flex-col gap-5 items-center h-screen">
        <div className="text-4xl font-bold underline pb-5 mt-5">
          {" "}
          Moje termíny
        </div>
        <Pills data={Moje} owned={true} />
      </div>
    </main>
  );
}
