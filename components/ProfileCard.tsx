/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { patchProfileAction } from "@/actions/settings.actions";
import { useUserStore } from "@/store/user.store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";


export default  function  ProfileCard ()  {
  const user = useUserStore((store) => store.user);
  const setUser = useUserStore((store) => store.setUser);

  const [name, setName] = useState(user?.name ?? "");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);

  //  nlob pour voir le nouvel avatar avant qu'il soit envoyé en db
  const [preview, setPreview] = useState<string | null>(
    user?.avatarUrl ?? null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setPreview(user.avatarUrl ?? null);
  }, [user]);

  // Qd on créé un blob, une url temporaire
  // il faut penser à cleanup l'url après utilisation
  useEffect(() => {
    const previousPreview = preview;
    return () => {
      //  qd on créé le blob, ce terme apparait dans l'url !
      //  pratique pour le cibler et l'effacer
      if (previousPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(previousPreview);
      }
    };
  }, [preview]);

  // Handle file
  function handleFile (file: File) {
    setFile(file);
    //  setPreview permet d'avoir une version temporaire de l'url de l'image
    //  pour avoir une preview du nouvelle avatar
    const url = URL.createObjectURL(file);
    setPreview(url);
    console.log(url)
  };

    async function handleSubmit  (evt: React.FormEvent<HTMLFormElement>)  {
    
    evt.preventDefault();
    setLoading(true);
      
    try {
      const updatedUser = await patchProfileAction({ name, password, file });
      setUser(updatedUser);
      setPreview(updatedUser.avatarUrl ?? null);
      toast.success("User profile updated");
    } catch (error) {
      console.log(error);
      toast.error("Error during update");
    } finally {
      setPassword("");
      setFile(null);
      setLoading(false);
    }
  };

  if (!user) return <>No user</>;

  return (
    <div className="pt-6 bg-gray-50 shadow-2xl rounded-2xl w-full p-4 overflow-hidden" 
    >
      <h2 className="text-lg mb-2 font-bold text-indigo-900">Profile</h2>
      {/* FORM */}
      <form className="flex flex-col gap-y-2" onSubmit={handleSubmit}>
        {/* AVATAR  */}
        <div className="flex flex-wrap items-center gap-4">
          {preview ? (
            <div className="w-16 h-16 overflow-hidden">
              <Image
                src={preview}
                alt="avatar "
                height={64}
                width={64}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          ) : (
            <div>{name}</div>
          )}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Upload image</label>
            <label className="inline-flex items-center gap-3">
              <span className="px-3 py-2 bg-stone-800 text-white rounded-lg cursor-pointer">
                Choisir un fichier
              </span>
              <span className="text-sm truncate max-w-37.5">
                {file?.name || "Aucun fichier"}
              </span>
              <input
                type="file"
                className="hidden"
                onChange={(evt) => {
                  // console.log(evt.target.files ?.[0]);
                  const file = evt.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </label>
          </div>
        </div>
        {/* NAME  */}
        <div className="">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            value={name}
            onChange={(evt) => setName(evt.target.value)}
            type="text"
            id="name"
            name="name"
            className="w-full border-2 rounded px-2 py-1"
            required
          />
        </div>
        {/* PASSWORD */}
        <div className="">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
            type="text"
            id="password"
            name="password"
            className="w-full border-2 rounded px-2 py-1"
          />
        </div>
        {/* ACTIONS */}
        <button
          type="submit"
          className="bg-gray-600 hover:bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer transition-transform self-end"
        >
          {loading ? "Saving..." : "save"}
        </button>
      </form>
    </div>
  );
};
