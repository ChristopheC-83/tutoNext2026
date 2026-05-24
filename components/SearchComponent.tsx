"use client";

import { searchAction } from "@/actions/search.actions";
import {
  SearchClient,
  SearchInvoice,
  SearchResponse,
  SearchResult,
} from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

const SearchComponent = () => {
  const router = useRouter();
  //  on initialise la recherche
  const [query, setQuery] = useState("");
  // permet de lancer une recherche à la fin de la frappe, pas à chaque lettre
  //  ça evite de lancer le useEffect à chaque lettre
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<SearchResponse>({
    clients: [],
    invoices: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // pour afficher le menu de recherche

  function handleSelect(item: SearchResult) {
    setQuery("");
    setResults({ clients: [], invoices: [] });
    setIsOpen(false);
    if (item.type === "client") {
      router.push(`/clients/${item.id}`);
    } else {
      router.push(`/invoices/${item.id}`);
    }
  }

  useEffect(() => {
    if (!debouncedQuery) {
      return;
    }
    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const data = await searchAction(debouncedQuery);
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.log("Search failure", error);
        setResults({ clients: [], invoices: [] });
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [debouncedQuery]);

  const clientsList = results.clients ?? [];
  const invoicesList = results.invoices ?? [];

  const concatResults: SearchResult[] = [
    ...clientsList.map((c: SearchClient) => ({
      ...c,
      type: "client" as const, // on force le type pour expliquer que c'est une const, pas un string
    })),
    ...invoicesList.map((i: SearchInvoice) => ({
      ...i,
      type: "invoice" as const,
    })),
  ];

  return (
    <div className="relative hidden lg:block">
      <input
        value={query}
        onChange={(evt) => {
          setQuery(evt.target.value);
          if (evt.target.value.length === 0) {
            setIsOpen(false);
          }
        }}
        aria-label="Search clients and invoices..."
        placeholder="Search a client, email, invoice number"
        className="ml-2 bg-white w-80 text-black rounded px-2 py-1 hover:outline-2 hover:outline-fuchsia-300 hover:bg-white hover:cursor-text focus:bg-white focus:outline-fuchsia-300"
      />
      <button
        aria-label="Clear search"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-slate-800 cursor-pointer"
        onClick={() => {
          setQuery("");
          setIsOpen(false);
          setResults({ clients: [], invoices: [] });
        }}
      >
        x
      </button>
      {isLoading && (
        <div className="absolute mt-2 w-full bg-white border rounded shadow p-3 text-sm text-stone-500">
          Searching...
        </div>
      )}
      {!isLoading && isOpen && concatResults.length === 0 && (
        <div className="absolute mt-2 w-full bg-white border rounded shadow p-3 text-sm text-stone-500">
          No results
        </div>
      )}
      {!isLoading && isOpen && concatResults.length > 0 && (
        <div className="absolute mt-2 w-full bg-white border rounded shadow p-3 text-sm text-stone-500 flex flex-col items-start gap-x-4 z-10 overflow-hidden">
          {concatResults.map((item: SearchResult) => {
            return (
              <button key={item.id} onClick={() => handleSelect(item)}>
                {item.type === "client" ? (
                  <div className="flex items-center gap-x-2 py-1">
                    <p className="font-medium text-xs truncate max-w-37.5">
                      {item.name}
                    </p>
                    <p className="text-xs text-stone-500">{item.email}</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-x-2 py-1">
                    <p className="font-medium text-xs">{item.number}</p>
                    <p className="text-xs text-stone-500 truncate max-w-37.5">
                      {item.name}
                    </p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default SearchComponent;
