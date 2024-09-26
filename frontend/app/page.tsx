import AppBar from "@/components/appbar";
import Hero from "@/components/hero";
import Image from "next/image";

export default function Home() {
  return (
    <div className="mx-5 flex flex-col  my-5">
      <AppBar />
      <Hero/>
    </div>
  );
}
