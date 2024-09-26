import Image from "next/image";

export default function AppBar() {
  return (
    <div className="flex justify-between align-middle border-b-2 pb-2  ">
      <div className="flex gap-10">
        <div className="logoText flex align-bottom ">
          <div className="p-1 max-h-0  bg-orange-500"></div>
          <div className="text-2xl font-extrabold">Zapier</div>
        </div>
        <div>Products</div>
        <div>Solutions</div>
        <div>Resources</div>
        <div>Enterprise</div>
        <div>Pricing</div>
      </div>
      <div className="flex items-center gap-6">
        <div>Explore apps</div>
        <div>Contact Sales</div>
        <div>login</div>
        <div className="flex p-4 text-white rounded-lg bg-orange-500 h-3 justify-center align-middle items-center text-center">
          <div>Signup</div>
        </div>
      </div>
    </div>
  );
}
