"use client";
import { ZapCell } from "@/components/zapcell";
import { useState } from "react";

export default function () {
  const [selectedTrigger, setSelectedTrigger] = useState("");
  const [selectedActions, setSelectedActions] = useState<
    {
      availableActionId: string;
      availableActionName: string;
    }[]
  >([]);
  return (
    <div className="w-full  flex flex-col mx-auto  justify-center  h-screen  bg-slate-200">
      <div className="justify-center mb-3 flex">
        <ZapCell
          onClick={() => {
            console.log("helo");
          }}
          name={selectedTrigger ? selectedTrigger : "Trigger"}
          index={1}
        />
      </div>
      <div className=" flex-col  flex justify-center   mx-auto  ">
        {selectedActions.map((x, index) => {
          return (
            <ZapCell
            
              key={index}
              onClick={() => {
                console.log("helo");
              }}
              name={x ? x.availableActionName : "action"}
              index={index + 1}
            />
          );
        })}
      </div>
      <button
        className="text-4xl  font-semibold"
        onClick={() => {
          setSelectedActions((a) => [
            ...a,
            {
              availableActionId: "",
              availableActionName: "game",
            },
          ]);
        }}
        type="button"
      >
        +
      </button>
    </div>
  );
}
