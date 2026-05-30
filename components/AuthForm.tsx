"use client";

import { loginAction, registerAction } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";


//  nous avons ici un formulaire unique pour login et register
//  la props "mode" permet de savoir quel formulaire afficher

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  //  ici mode ne peut prendre que 2 valeurs distinctes
  const isRegister = mode === "register";
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);
    //Try/catch/finally to handle error , because it s a client compnt
    try {
      if (isRegister) {
        await registerAction({ name, email, password });
        toast.success("You are registered. Please now login.");
        //  si enregistrement ok, on va vers login
        router.push("/login");
      } else {
        await loginAction({ email, password });
        toast.success("You are logged in.");
        //  si login ok, on va vers dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      const message =
        //  si l'erreur vient d'un thow Error alors error.message
        //  en provenance de notre fichier action
        //  sinon message generique
        error instanceof Error ? error.message : "Something went wrong";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-[80%] text-black  sm:max-w-sm bg-white  p-8 rounded-2xl shadow-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {isRegister ? "Create an account" : "Login"}
      </h1>
      <form onSubmit={handleSubmit}>
        {/*  pour le login, pas besoin du name */}
        {isRegister && (
          <div>
            <label className="text-sm text-gray-600" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full mt-1 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div>
          <label className="text-sm text-gray-600" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full mt-1 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-gray-600" htmlFor="password">
            Password
          </label>
          <input
            // type="text" // en prod, on mettra password et pas text !
            type="password" 
            id="password"
            name="password"
            className="w-full mt-1 px-2 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          disabled={isLoading}
          type="submit"
          className="mt-8 mb-2 w-full bg-black text-white py-2  rounded-lg hover:bg-gray-800 cursor-pointer transition-transform"
        >
          {isRegister ? "Create an account" : "Login"}
        </button>
        <p className="text-sm text-center ">
          {isRegister ? "Already have an account?" : "No account yet?"}{" "}
          <span
            className="ml-2 hover:underline cursor-pointer"
            onClick={() => router.push(isRegister ? "/login" : "/register")}
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </p>
      </form>
    </div>
  );
}
