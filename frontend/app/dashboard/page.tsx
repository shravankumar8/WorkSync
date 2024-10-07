"use client"
import React, { useEffect, useState } from "react";
  const HOOKS_URL = process.env.HOOKS_URL || "http://localhost:3001";
import axios from "axios";
import { useRouter } from "next/navigation";
const PRIMARYBACKENDURL = process.env.PRIMARYBACKENDURL || "http://localhost:3001"
interface Zap {
  id: string;
  createdAt:string;
  triggerId: string;
  userId: number;
  actions: {
    id: string;
    zapId: string;
    actionId: string;
    sortingOrder: number;
    type: {
      id: string;
      name: string;
      image: string;
    };
  }[];
  trigger: {
    id: string;
    zapId: string;
    triggerId: string;
    type: {
      id: string;
      name: string;
      image: string;
    };
  };
}
function useZap() {
  const [loading, setLoading] = useState(true);
  const [zaps, setZaps] = useState<Zap[]>([]);
  console.log(localStorage.getItem("token"));
  useEffect(() => {
    axios
      .get(`${PRIMARYBACKENDURL}/api/v1/zap`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setZaps(res.data.zaps);
        setLoading(false);
      });
  }, []);
  return { loading, zaps };
}
const Dashboard = () => {
  const { loading, zaps } = useZap();
  const router=useRouter()
  return (
    <div className="m-14">
      
      <div className="flex justify-between   items-center">
        <div className="text-center mx-auto text-xl font-bold ">My zaps </div>
        <button onClick={()=>{
          router.push("/zap/create")
        }} className=" bg-blue-700 px-4 rounded-lg text-lg text-white font-bold py-2  ">
          Create zap
        </button>
      </div>
      <div className="zaps mt-3 list">
        {loading ? "loadin...." : <ZapTable zaps={zaps} />}
      </div>
    </div>
  );
};
function ZapTable({ zaps }: { zaps: Zap[] }) {
  const router=useRouter()
  return (
    <div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Open
              </th>
              <th scope="col" className="px-6 py-3">
                Created at
              </th>
              <th scope="col" className="px-6 py-3">
                Webhook URL
              </th>
              <th scope="col" className="px-6 py-3">
                zap action
              </th>
              
              <th scope="col" className="px-6 py-3">
                trigger id
              </th>
            </tr>
          </thead>
          <tbody>
            {zaps.map((zap) => (
              <tr key={zap.id}>
                {/* Display the zap's trigger information */}

                <td className="px-6 py-4 whitespace-nowrap">{zap.id}</td>
                <td className="px-6 py-4 items-center whitespace-nowrap text-sm text-gray-500">
                  <div className="flex-1">
                    <button
                      className="bg-blue-700 px-4 py-2 rounded-lg text-white"
                      onClick={() => {
                        router.push("/zap/" + zap.id);
                      }}
                    >
                      open zap
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {<DateFormatter date={zap.createdAt} />}
                </td>
                <td className="px-6 py-4 items-center whitespace-nowrap">
                  <div className="flex-1">
                    <button
                      className="bg-blue-700 px-4 py-2 rounded-lg text-white"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${HOOKS_URL}/hooks/catch/1/${zap.id}`
                        );
                      }}
                    >
                      Copy Webhook
                    </button>
                  </div>
                </td>

                {/* Display the zap's actions */}
                <td className="px-6 py-4 items-center flex gap-2 whitespace-nowrap text-sm text-gray-500">
                  {zap.actions.map((action) => (
                    <div className="" key={action.id}>
                      <br />
                      {action.type.name}→
                    </div>
                  ))}
                </td>
                    {/* Display trigger type details */}
                <td className="px-6 py-4 items-center flex gap-2  whitespace-nowrap text-sm text-gray-500">
                  <div className="flex  flex-wrap-reverse min-w-56">
                    <img width={30} src={zap.trigger.type.image} alt="" /> ➜
                    {zap.actions.map((action) => (
                      <img width={30} src={action.type.image} alt="" />
                    ))}
                  </div>
                </td>
                {/* Display trigger type details */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {zap.trigger.type.name || "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DateFormatter({ date }: { date: string }) {
  const formattedDate = new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return <span>{formattedDate}</span>;
}


export default Dashboard;
