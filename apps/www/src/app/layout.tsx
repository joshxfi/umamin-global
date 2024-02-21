import Script from "next/script";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import { Menu } from "@/components/menu";
import { Navbar } from "@/components/navbar";
import { ApolloWrapper } from "./ApolloWrapper";
import { Toaster } from "@/components/ui/sonner";
import { Maintenance } from "@/components/maintenance";
import NextAuthProvider from "@/context/NextAuthProvider";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Umamin Global",
  description: "A Social Platform for the Umamin Community",
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
              {process.env.NEXT_PUBLIC_MAINTENANCE ? (
                <Maintenance />
              ) : (
                <>
                  {children}
                  <Menu />
                </>
              )}
            </div>
          </ApolloWrapper>
        </NextAuthProvider>
      </body>

      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4274133898976040"
        crossOrigin="anonymous"
      />
    </html>
  );
}
