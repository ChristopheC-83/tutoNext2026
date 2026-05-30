"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  function handleClick() {
    if (window.history.length > 1) {
      router.back();
    }
    router.push("/dashboard");
  }

  return (
    <div
      onClick={handleClick}
      className="ml-8 px-2 py-1 w-32 flex items-center flex-start gap-x-4 bg-black text-white rounded-lg cursor-pointer transition-transform hover:bg-stone-400 hover:text-black"
    >
      <ArrowLeft />
      Back
    </div>
  );
}
