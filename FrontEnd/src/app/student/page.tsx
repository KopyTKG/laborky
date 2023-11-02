import { Terminy } from "@/data/terminy";
import Pills from "@/modules/terminy.display";

export default function StudentPage() {
  return (
    <main className="h-screen">
      <div className="w-full flex flex-col gap-5 items-center h-screen">
        <div className="text-4xl font-bold underline pb-5 mt-5">
          {" "}
          Vypsane termíny
        </div>
        <Pills data={Terminy} />
      </div>
    </main>
  );
}
