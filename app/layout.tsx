import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/app/providers/AuthProvider";

export const metadata: Metadata = {
  title: "SemShot",
  description: "AI Exam Preparation Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}