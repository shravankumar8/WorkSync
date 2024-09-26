import Link from "next/link";
export default function AppBar() {
  return (
    <div className="flex justify-between align-middle border-b-2 pb-2  ">
      <div className="flex gap-10">
        <div className="logoText flex align-bottom ">
          <div className="p-1 max-h-0  bg-orange-500"></div>
          <div className="text-2xl font-extrabold">
            <Link href="/zapier">Zapier</Link>
          </div>
        </div>
        <div>
          {" "}
          <Link href="/products">Products</Link>
        </div>
        <div>
          {" "}
          <Link href="/solutions">Solutions</Link>
        </div>
        <div>
          {" "}
          <Link href="/resources">Resources</Link>
        </div>
        <div>
          {" "}
          <Link href="/enterprise">Enterprise</Link>
        </div>
        <div>
          {" "}
          <Link href="/pricing">Pricing</Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div><Link href="/explore-apps">Explore apps</Link></div>
        <div><Link href="/Sales">Contact Sales</Link></div>
        <div><Link href="/>login">login</Link></div>
        <div className="flex p-4 text-white rounded-lg bg-orange-500 h-3 justify-center align-middle items-center text-center">
          <div>
            <Link href="/signup">Signup</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
