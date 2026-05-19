import BackButton from "./BackButton";
import DashboardButton from "./DashboardButton";

export default function ButtonsBar() {
  return (
    <div className="flex flex-wrap items-center justify-start gap-x-2 py-4 bg-stone-300  gap-y-4">
      <BackButton />
      <DashboardButton />
    </div>
  );
}
