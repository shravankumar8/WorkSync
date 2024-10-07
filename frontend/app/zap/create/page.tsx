"use client";

import { ZapCell } from "@/components/zapcell";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const PRIMARYBACKENDURL =
  process.env.PRIMARYBACKENDURL || "http://localhost:3001";

function useAvailableActionsAndTriggers() {
  const [availableActionIds, setAvailableActionIds] = useState<
    {
      id: string;
      name: string;
      image: string;
    }[]
  >([]); // Default to an empty array

  const [availableTriggerIds, setAvailableTriggerIds] = useState<
    {
      id: string;
      name: string;
      image: string;
    }[]
  >([]); // Default to an empty array

  useEffect(() => {
    // fetching triggers
    axios
      .get(`${PRIMARYBACKENDURL}/api/v1/trigger/available`)
      .then((res) => setAvailableTriggerIds(res.data.availableTriggers));
    axios
      .get(`${PRIMARYBACKENDURL}/api/v1/action/available`)
      .then((res) => setAvailableActionIds(res.data.availableAction));
  }, []);

  return { availableActionIds, availableTriggerIds };
}

export default function MyComponent() {
  const router = useRouter();
  const { availableActionIds, availableTriggerIds } =
    useAvailableActionsAndTriggers();
  const [selectedModelIndex, setSelectedModelIndex] = useState<null | number>();
  const [selectedTrigger, setSelectedTrigger] = useState<{
    name: string;
    id: string;
  }>();
  const [selectedActions, setSelectedActions] = useState<
    { index: number; availableActionId: string; availableActionName: string }[]
  >([]);
  return (
    <div className="w-full  flex flex-col relative mx-auto  justify-center  h-screen  bg-slate-200">
      <div className="absolute top-3 right-3">
        <button
          onClick={() => {
            if (!selectedTrigger?.id) {
              alert("No Option is Selected ");
              return;
            }
            const response = axios.post(
              `${PRIMARYBACKENDURL}/api/v1/zap`,
              {
                availableTriggerId: selectedTrigger.id,
                triggerMetadata: "email ",
                actions: selectedActions.map((action) => ({
                  availableActionId: action.availableActionId,
                  actionMetadata: {},
                })),
              },
              {
                headers: {
                  authorization: `${localStorage.getItem("token")}`,
                },
              }
            );
            const resp = response.then((res) => {
              alert(res.data);
              return res.data;
            });
          }}
          className=" bg-blue-700 px-4 rounded-lg text-lg text-white font-bold py-2  "
        >
          Create zap
        </button>
      </div>
      <div className="justify-center mb-3 flex">
        <ZapCell
          onClick={() => {
            setSelectedModelIndex(1);
          }}
          name={selectedTrigger?.name ? selectedTrigger.name : "Trigger"}
          index={1}
        />
      </div>
      <div className=" flex-col  flex justify-center   mx-auto  ">
        {selectedActions.map((x, index) => {
          return (
            <ZapCell
              key={index}
              onClick={() => {
                setSelectedModelIndex(x.index);
              }}
              name={x.availableActionName ? x.availableActionName : "action"}
              index={x.index}
            />
          );
        })}
      </div>
      <div className="w-full items-center justify-center flex">
        <button
          className="text-2xl rounded-2xl bg-orange-600 px-2  font-semibold"
          onClick={() => {
            setSelectedActions((a) => [
              ...a,
              {
                index: a.length + 2,
                availableActionId: "",
                availableActionName: "click to select ",
              },
            ]);
          }}
          type="button"
        >
          +
        </button>
      </div>
      {selectedModelIndex && (
        <Modal
          availableItems={
            selectedModelIndex === 1 ? availableTriggerIds : availableActionIds
          }
          index={selectedModelIndex}
          onSelect={(props: null | { name: string; id: string }) => {
            if (props === null) {
              setSelectedModelIndex(null);
              return;
            }

            if (selectedModelIndex === 1) {
              setSelectedTrigger({
                id: props.id,
                name: props.name,
              });
            } else {
              setSelectedActions((a) => {
                let newactions = [...a];
                newactions[selectedModelIndex - 2] = {
                  index: selectedModelIndex,
                  availableActionId: props.id,
                  availableActionName: props.name,
                };
                return newactions;
              });
            }
            setSelectedModelIndex(null);
          }}
        />
      )}
    </div>
  );
}
function Modal({
  availableItems,
  index,
  onSelect,
}: {
  availableItems: {
    id: string;
    name: string;
    image: string;
  }[];
  index: number;
  onSelect: (props: null | { name: string; id: string }) => void;
}) {
  return (
    <div
      id="default-modal"
      aria-hidden="true"
      className=" overflow-y-auto text-black overflow-x-hidden flex bg-slate-700 bg-opacity-30 backdrop-blur-sm fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow ">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
            <h3 className="text-xl font-semibold  ">
              Select a {index === 1 ? "trigger" : "action"}
            </h3>
            <button
              onClick={() => {
                onSelect(null);
              }}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center  dark:hover:text-white"
              data-modal-hide="default-modal"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            {availableItems.map((item) => {
              return (
                <div
                  onClick={() => {
                    onSelect({
                      id: item.id,
                      name: item.name,
                    });
                  }}
                  className="flex hover:bg-slate-100 align-middle border rounded-lg cursor-pointer  items-center  "
                >
                  <div className="m-2 " key={item.id}>
                    {" "}
                    {/* Always include a key prop when rendering lists */}
                    <img width={30} src={item.image} alt="" />
                  </div>

                  <div className="m-2" key={item.id}>
                    {" "}
                    {/* Always include a key prop when rendering lists */}
                    {item.name}
                  </div>
                </div>
                // Add return statement here
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
