import BurgerButton from "./BurgerButton";
import ButtonsBar from "./ButtonsBar";
import Topbar from "./Topbar";
export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 h-screen overflow-y-auto mb-4  flex-col relative transition-transform duration-700 ease-in-out ms-20 sm:ms-52">
      <BurgerButton />
      <Topbar />
      <ButtonsBar />
      <main className="p-6 flex-1 bg-stone-200 text-black min-h-screen">
        {children}
      </main>
    </div>
  );
}
