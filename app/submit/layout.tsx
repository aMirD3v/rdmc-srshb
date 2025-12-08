
import SubmitterSidebar from "@/components/submit/SubmitterSidebar";
import UserNav from "@/components/auth/UserNav";

export default function SubmitterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100">
      <SubmitterSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Submitter Dashboard</h1>
          <UserNav />
        </header>
        <main className="flex-grow p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
