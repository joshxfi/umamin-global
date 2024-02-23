import { cn } from "@/lib/utils";
import React, { useEffect } from "react";

interface Props {
  slotId: string;
  className?: string;
  test?: boolean;
  type?: "display" | "in-feed";
}

const AdSense = ({ slotId, className, test, type = "display" }: Props) => {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  return (
    <div
      className={cn("adsbygoogle", className, {
        "h-24 bg-blue-200": test,
      })}
    >
      {type === "in-feed" ? (
        <ins
          style={{ display: "block" }}
          data-ad-client="ca-pub-4274133898976040"
          data-ad-slot={slotId}
          data-ad-format="fluid"
          data-ad-layout-key="-fb+5w+4e-db+86"
        />
      ) : (
        <ins
          style={{ display: "block" }}
          data-ad-client="ca-pub-4274133898976040"
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
};

export default AdSense;
