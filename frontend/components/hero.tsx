"use client";
import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";
export default function Hero() {
  const router = useRouter();
  return (
    <div className=" justify-between grid grid-cols-2 align-middle m-16 pb-2  ">
      <div className="flex flex-col gap-5   ">
        <div
          onClick={() => {
            router.push("/tour");
          }}
          className="flex  cursor-pointer  gap-2 font-semibold px-2 py-2 max-w-52 bg-gray-200 rounded-xl items-center"
        >
          <div className="border-[1px] border-black px-2 py-1 flex  rounded-xl">
            New
          </div>
          <div>Take a tour -&gt;</div>
        </div>
        <div className="text-8xl leading-[90px] max-w-7 text-black">
          Automate without limits
        </div>
        <div className="text-2xl leading-6 max-w-7xl  text-black">
          Turn chaos into smooth operations by automating workflows yourself—no
          developers, no IT tickets, no delays. The only limit is your
          imagination.
        </div>
        <div className="flex gap-4">
          <div
            onClick={() => {
              router.push("/signup");
            }}
            className="flex p-6 text-white cursor-pointer rounded-3xl bg-orange-700 h-3 justify-center align-middle items-center text-center"
          >
            Start with a free Email
          </div>
          <div
            onClick={() => {
              router.push("/googleoauth");
            }}
            className="flex p-6 cursor-pointer border-[1px] border-black  rounded-3xl  h-3 justify-center align-middle items-center text-center"
          >
            Start with google
          </div>
        </div>
      </div>
      <div>
        <div>
          <Image
            src="https://res.cloudinary.com/zapier-media/image/upload/q_auto/f_auto/v1726210651/Homepage%20%E2%80%94%20Sept%202024/homepage-hero_vvpkmi.png"
            alt="Hero Image"
            width={800}
            height={500}
            priority
          />
        </div>
      </div>
    </div>
  );
}
