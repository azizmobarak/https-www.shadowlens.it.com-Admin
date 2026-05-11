import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shadow AI | Super Admin",
  description: "Global Management Console",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased overflow-x-hidden" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
