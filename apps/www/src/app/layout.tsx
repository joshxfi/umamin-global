import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";

import { Menu } from "@/components/menu";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import NextAuthProvider from "@/context/NextAuthProvider";

import "./globals.css";
import { ApolloWrapper } from "./ApolloWrapper";
import Script from "next/script";

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
      <Script
        async
        strategy="beforeInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4274133898976040"
        crossOrigin="anonymous"
      />

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
