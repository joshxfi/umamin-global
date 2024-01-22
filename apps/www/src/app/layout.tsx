import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import { Menu } from "@/components/menu";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import NextAuthProvider from "@/context/NextAuthProvider";

import "./globals.css";
import { ApolloWrapper } from "./ApolloWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Umamin Global",
  description: "A global channel for the umam.in ecosystem.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <NextAuthProvider>
          <NextTopLoader showSpinner={false} />
          <Toaster />
          <ApolloWrapper>
            <div className="max-w-screen-sm mx-auto">
              <Navbar />
              {children}
              <Menu />
            </div>
          </ApolloWrapper>
        </NextAuthProvider>
      </body>
    </html>
  );
}
