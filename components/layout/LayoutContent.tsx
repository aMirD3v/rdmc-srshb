'use client';

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function LayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isSubmitterPage = pathname.startsWith("/submit");

  return (
    <>
      {isAdminPage || isSubmitterPage ? (
        <main>{children}</main>
      ) : (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}