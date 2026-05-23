"use client";

// import { useUiStore } from "@/store/ui.store";
import { ToastContainer } from "react-toastify";

export default function ThemedToastContainer() {
  //   const theme = useUiStore((store) => store.theme);

  return (
    <ToastContainer
      position="top-right"
      autoClose={1500}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      pauseOnHover
      //   theme={theme}
    />
  );
}
