import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ghost Messages || Anonymous Messaging Platform",
  description: "Makes the anonymous guy message you. Seeing how others think of you? It's a fun guessing game!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
      <body className={inter.className}>
        {children}  
        <Toaster />
        <Analytics mode={'production'} />
      </body>
      </AuthProvider>
    </html>
  );
}
