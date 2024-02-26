import { cn } from "@/lib/utils";
import React, { useEffect } from "react";

interface Props {
  slotId: string;
  className?: string;
  test?: boolean;
}

const AdSense = ({ slotId, className, test }: Props) => {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && typeof window === "object") {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  return (
    <ins
      className={cn("adsbygoogle", className, {
        "h-24 bg-blue-200": test,
      })}
      style={{ display: "block" }}
      data-ad-client="ca-pub-4274133898976040"
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default AdSense;
