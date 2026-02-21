import type { Metadata } from "next";
// Removed Google Fonts due to network fetching errors.
// Using standard Tailwind sans/mono fonts.

import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Teamlink Consultants",
  description: "Enterprise open-source employee management system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-slate-50 flex h-screen overflow-hidden font-sans`}
      >
        <Sidebar />
        <main className="flex-1 min-w-0 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
