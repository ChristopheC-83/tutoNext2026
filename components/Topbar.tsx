import Logout from "./Logout";
import SearchComponent from "./SearchComponent";
import UserMenu from "./UserMenu";

export default function Topbar() {
  return (
    <header className="shadow px-6 py-4 flex items-center justify-between dark:bg-gray-800 bg-gray-200 dark:text-white">
      <div className="ml-10">
        <SearchComponent />
      </div>
      <div className="flex items-center gap-x-4 my-2">
        <div className="">
          <UserMenu />
        </div>
        <div className="bg-stone-900 text-white px-2 py-1 rounded-full hover:bg-slate-50 hover:text-blue-600 cursor-pointer transition-transform">
          <Logout />
        </div>
      </div>
    </header>
  );
}
