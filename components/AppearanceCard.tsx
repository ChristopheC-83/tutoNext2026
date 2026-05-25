// "use client";

// // import { useUiStore } from "@/store/ui.store";
// import { toast } from "react-toastify";

// export default function AppearanceCard() {

//     const theme = ""
//     // const theme = useUiStore((store) => store.theme);
//     // const toggle = useUiStore((store) => store.toggleTheme);

//     const handleClick = () => {
//     //   toggle();
//       toast.success("User profile updated");
//     };
//   return (
//     <div className="pt-6 bg-gray-50 shadow-2xl rounded-2xl w-full p-6 space-y-6">
//       <h2 className="text-lg mb-2 font-bold text-indigo-900">Appearance</h2>
//       <div className="flex items-center justify-between">
//         <div>
//           <p className="font-medium">Theme ({theme})</p>
//           <p className="font-sm text-gray-500">Switch light / dark mode</p>
//         </div>
//         <button
//           onClick={handleClick}
//           className="px-4 py-2 rounded-lg bg-gray-200 hover:opacity-80 cursor-pointer transition-transform"
//         >
//           {theme === "light" ? "dark" : "light"}
//         </button>
//       </div>
//     </div>
//   );
// }
