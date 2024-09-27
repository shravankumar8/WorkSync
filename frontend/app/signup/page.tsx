"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  return (
    <div className=" justify-between grid grid-cols-2 align-middle m-20 pb-2  ">
      <div className="flex p-12 flex-col">
        <div className="text-4xl  max-w-md font-semibold">
          Join millions worldwide who automate their work using Zapier.
        </div>
        <div>
          <ul className="flex mt-9 flex-col gap-4">
            <li>✅️ Easy setup, no coding required</li>
            <li>✅️ Free forever for core features</li>
            <li>✅️ 14-day trial of premium features & apps</li>
          </ul>
        </div>
      </div>
      <div>ded</div>
    </div>
  );
}

