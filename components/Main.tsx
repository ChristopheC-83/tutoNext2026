
export default function Main({children}: {children: React.ReactNode}) {
  return (
    <div className="flex-1 h-screen overflow-y-auto mb-4  flex-col relative transition-transform duration-700 ease-in-out">
          <div> BurgerButton</div>
          <div>TopBar</div>
          <div>ButtonBar</div>
          <main className="p-6 flex-1 bg-stone-200 text-black min-h-screen">{children}</main>
    </div>
  )
}
