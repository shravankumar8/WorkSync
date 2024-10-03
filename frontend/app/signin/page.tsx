"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
   
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const body = {
      email: formData.email,
     
      password: formData.password,
    };
    try {
      // Send a POST request to your backend
      const response = await fetch("http://localhost:3001/api/v1/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body), // Send form data in JSON format
      });

      // Handle response
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        // Success - display success message
        setSuccess("Signup successful!");
        alert("Signup successful!");
       localStorage.setItem("token", result.user.token);

        setError(""); // Clear any previous error messages
        router.push("/dashboard")
      } else {
        if (result.error) {
          const messages = result.error.issues.map(
            (issue: any) => issue.message
          );
          alert(messages);
        } else {
          alert(result.message);
        }

        // Failure - display error message
        setError(result.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      alert("An error occurred. Please try again.");
      // Network or other error
      setError("An error occurred. Please try again.");
    }
  };
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <main className=" justify-between  grid grid-cols-2 align-middle m-14 pb-2  ">
      <div className="flex p-12 flex-col">
        <div className="text-4xl  max-w-md font-semibold">
          Join millions worldwide who automate their work using Zapier.
        </div>
        <div>
          <nav>
            <ul className="flex mt-9 flex-col gap-4">
              <li>✅️ Easy setup, no coding required</li>
              <li>✅️ Free forever for core features</li>
              <li>✅️ 14-day trial of premium features & apps</li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="flex flex-col  border-2 gap-5  p-4 max-w-md">
        <div className="flex align-bottom bg-blue-600 rounded-xl text-white items-center p-2 justify-evenly">
          <div className="text-2xl">𝕏</div>
          <div>signin with google</div>
        </div>
        <div className="self-center">OR</div>
        <div>
          <form onSubmit={handleSubmit} className="flex gap-2 flex-col">
            <div className="flex gap-2 flex-col">
              <label htmlFor="">Work Email (required)</label>
              <input
                className="border-[1px] border-gray-700 text-black p-3 rounded-lg"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex gap-3">
              
              <div className="flex gap-2 min-w-3  flex-col">
                <label htmlFor="">password (required)</label>
                <input
                  className="border-[1px] text-black border-gray-700 p-3 rounded-lg"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="flex p-6 text-white text-xl font-semibold cursor-pointer rounded-3xl bg-orange-600 h-3 justify-center align-middle items-center text-center"
            >
              get started for free
            </button>
          </form>
          <p className="mt-5">
            By signing up, you agree to Zapier's terms of service and privacy
            policy.
          </p>
        </div>
      </div>
    </main>
  );
}
