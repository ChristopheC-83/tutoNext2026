"use client";

import {
  createClientAction,
  patchOneClientAction,
} from "@/actions/clients.actions";
import { ClientDTO } from "@/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props =
  | { mode: "create"; client?: undefined }
  | { mode: "edit"; client: ClientDTO };

export default function ClientForm({ mode, client }: Props) {
  const router = useRouter();

  const [name, setName] = useState(client?.name || "");
  const [email, setEmail] = useState(client?.email || "");
  const [company, setCompany] = useState(client?.company || "");
  const [phone, setPhone] = useState(client?.phone || "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(client?.avatarUrl || null);
  const [isLoading, setIsLoading] = useState(false);

  //Clenup blob memory
  useEffect(() => {
    const previousPreview = preview;
    return () => {
      if (previousPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(previousPreview);
      }
    };
  }, [preview]);

  // Handle file
  function handleFile(file: File) {
    setFile(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  function handleCreateInvoiceBtnClick(
    evt: React.MouseEvent<HTMLButtonElement>,
  ) {
    evt.preventDefault();
    router.push(`/invoices/new?clientId=${client?.id}`);
  }

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setIsLoading(true);
    let returnedClient;
    try {
      if (mode === "create") {
        const payload = { name, email, company, phone, file };
        returnedClient = await createClientAction(payload);
      } else {
        const payload = { name, email, company, phone, file };
        returnedClient = await patchOneClientAction({ id: client.id, payload });
      }
      if (returnedClient.avatarUrl) {
        setPreview(returnedClient.avatarUrl);
      }
      toast.success("Client saved/updated");
      // et on retourne sur la page "clients"
      // rester, pas utile, à réfléchir
      setTimeout(() => router.push(`/clients`), 1200);
    } catch (error) {
      console.log(error);
      toast.error("A problem occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-2xl shadow-2xl w-full"
    >
      {/* AVATAR  */}
      <div className="flex flex-wrap items-center gap-4">
        {preview ? (
          <div className="w-16 h-16 overflow-hidden rounded-full">
            <Image
              src={preview}
              alt="avatar"
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center ">
            {name}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Upload image</label>
          <label className="inline-flex items-center gap-3">
            <span className="px-3 py-2 bg-stone-800 text-white rounded-lg cursor-pointer">
              Choose a file
            </span>
            <span className="text-sm truncate max-w-37.5">
              {file?.name || "No file"}
            </span>
            <input
              type="file"
              className="hidden"
              onChange={(evt) => {
                const file = evt.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </label>
        </div>
      </div>
      {/* FIELDS  */}
      <div className="">
        <label htmlFor="name" className="text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="w-full border rounded px-3 py-2 dark:bg-gray-200"
          placeholder="name"
          value={name}
          onChange={(evt) => setName(evt.target.value)}
          required
        />
      </div>
      <div className="">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          type="text"
          id="email"
          name="email"
          className="w-full border rounded px-3 py-2 dark:bg-gray-200"
          placeholder="email"
          value={email}
          onChange={(evt) => setEmail(evt.target.value)}
          required
        />
      </div>
      <div className="">
        <label htmlFor="company" className="text-sm font-medium">
          Company
        </label>
        <input
          type="text"
          id="company"
          name="company"
          className="w-full border rounded px-3 py-2 dark:bg-gray-200"
          placeholder="company"
          value={company}
          onChange={(evt) => setCompany(evt.target.value)}
        />
      </div>
      <div className="">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone
        </label>
        <input
          type="text"
          id="phone"
          name="phone"
          className="w-full border rounded px-3 py-2 dark:bg-gray-200"
          placeholder="phone"
          value={phone}
          onChange={(evt) => setPhone(evt.target.value)}
        />
      </div>
      {/* ACTIONS  */}
      <div className="flex flex-wrap justify-end gap-x-4 gap-y-2">
        {client && (
          <button
            onClick={handleCreateInvoiceBtnClick}
            className="text-sm px-3 py-1 border rounded-lg cursor-pointer transition-transform hover:bg-stone-200 hover:text-black "
          >
            Create invoice
          </button>
        )}
        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg    "
        >
          {isLoading
            ? "Saving..."
            : mode === "create"
              ? "Create client"
              : "Update client"}
        </button>
      </div>
    </form>
  );
}
