"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="mb-16 pt-12 container">
      <Link href="/" className="text-sm text-muted-foreground">
        <span className="font-semibold text-white">global</span>.umamin
      </Link>
    </nav>
  );
}
