"use client";

import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { usePathname, useSearchParams } from "next/navigation";

interface Props {
  slotId: string;
  className?: string;
  test?: boolean;
}

const AdSense = ({ slotId, className, test }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && typeof window === "object") {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, [pathname, searchParams]);

  return (
    <div className={twMerge(className, test && "h-24 bg-blue-200")}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4274133898976040"
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSense;
