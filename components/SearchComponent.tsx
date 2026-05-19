export default function SearchComponent() {
  return (
    <div className="relative hidden lg:block">
      <input
        aria-label="Search client and invoices"
        placeholder="Search client, email or invoice number"
        className="ml-2 bg-white w-80 text-black rounded px-2 py-1 hover:outline-2 hover:outline-fuchsia-300 hover:bg-white hover:cursor-text focus:bg-white focus:outline-fuchsia-300"
      />
      <button
        aria-label="Clear search"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-slate-800 cursor-pointer"
        // onClick={() => {
        //   setQuery("");
        //   setIsOpen(false);
        //   setResults({ clients: [], invoices: [] });
        // }}
      >
        x
      </button>
    </div>
  );
}
