import { User as UserData } from "@/data/categorie";
import Laborator from "@/modules/laborator.module";
import { randomUUID } from "crypto";
export default function Terminy() {
  return (
    <>
      {UserData.Laborky.map((cat) => (
        <Laborator
          key={() => {
            return randomUUID();
          }}
          state={cat}
        />
      ))}
    </>
  );
}
