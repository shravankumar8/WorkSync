"use client";
import { Sign } from "crypto";
import { useRouter } from "next/navigation";
import React from "react";
const LoginPage = () => {
  const router = useRouter();
  return (
    <main className=" justify-between   grid grid-cols-2 py-24 pr-28 pl-28 pb-2  ">
      <div className="flex flex-col gap-3">
        <div className="text-4xl mt-4 max-w-lg font-semibold">
          Automate across your teams
        </div>
        <div className="text-lg  max-w-lg ">
          Zapier Enterprise empowers everyone in your business to securely
          automate their work in minutes, not months—no coding required.
        </div>
        <div className="rounded-lg bg-customPurple text-white text-xl p-3 max-w-xs  justify-center  flex">
          explore zap enterprice
        </div>
      </div>
      <div className="text-2xl flex flex-col gap-6 font-bold ">
        <div className=" text-center">Log in to your account</div>
        <div className="flex-col gap-5 p-5 flex border-[1px]  ">
          <div className=" text-sm text-center">Welcome Back</div>
          <div className=" flex flex-col gap-3 text-sm text-center">
            <div className="flex  align-bottom max-w-xs mx-auto bg-blue-600 rounded-xl text-white items-center p-2 justify-evenly">
              <div className="text-2xl">𝕏</div>
              <div>Signup with google</div>
            </div>
            <div className="font-normal">
              Or{" "}
              <span
                onClick={() => router.push("/signin")}
                className="underline cursor-pointer text-blue-800 "
              >
                use your email address to log in.
              </span>
            </div>
            <div className="font-normal">
              Don't have a Zapier account yet?
              <span
                onClick={() => router.push("/signup")}
                 className="cursor-pointer underline text-blue-800"
              >
                {" "}
                Sign Up
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
