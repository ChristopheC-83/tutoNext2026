import { getProfileAction } from "@/actions/settings.actions";
import Main from "@/components/Main";
import Sidebar from "@/components/Sidebar";
import UserHydrator from "@/components/UserHydrator";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  
  
  //User guard
  const user = await getProfileAction();

  return (
    <div className="relative flex h-screen overflow-hidden dark:bg-gray-800 bg-gray-200">
      <UserHydrator user={user} />
      <Sidebar />
      <Main>{children}</Main>
    </div>
  );
}
