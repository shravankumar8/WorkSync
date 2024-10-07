import Link from "next/link";
export default function AppBar() {
  return (
    <header className="flex justify-between border-b-2 pb-2  ">
      <div className="flex gap-10 ">
        <div className="logoText flex align-bottom ">
          <div className="p-1 max-h-0  bg-orange-500 "></div>
          <div className="text-2xl font-extrabold">
            <Link href="/zapier">Zapier</Link>
          </div>
        </div>
        <div className="flex gap-10 p-1 px-4">
  {['Products', 'Solutions', 'Resources', 'Enterprise', 'Pricing'].map((item) => (
    <div className="font-medium " key={item}>
      <Link 
         href={`/${item.toLowerCase()}`} 
          className="cool-link text-slate-800  "
      >
        {item}
      </Link>
      
    </div>
  ))}
</div>

      </div>
      <div className="flex items-center gap-6 p-1">
        <div className="font-medium "><Link href="/explore-apps" className="cool-link">Explore apps</Link></div>
        <div className="font-medium "><Link href="/Sales" className="cool-link">Contact Sales</Link></div>
        <div className="flex font-medium text-orange-500 hover:border-orange-500 hover:border-2 p-4 h-3 justify-center align-middle items-center text-center rounded-md transition-all duration-100 ease-in-out"><Link href="/login">Login</Link></div>
        <div className="flex p-4 font-medium  rounded-md border-2 border-orange-500 h-3 justify-center align-middle items-center text-center hover:bg-orange-500 hover:text-white transition-all duration-150 ease-in-out">
          <div>
            <Link href="/signup">Signup</Link>
            
          </div>
        </div>
      </div>
    </header>
  );
}