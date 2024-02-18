import React, { useEffect } from "react";

interface Props {
  slotId: string;
  className?: string;
  type?: "display" | "in-feed";
}

const AdSense = ({ slotId, className, type = "display" }: Props) => {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    }
  }, []);

  return (
    <div className={className}>
      {type === "in-feed" ? (
        <ins
          className="adsbygoogle block"
          data-ad-client="ca-pub-4274133898976040"
          data-ad-slot={slotId}
          data-ad-format="fluid"
          data-ad-layout-key="-fb+5w+4e-db+86"
        />
      ) : (
        <ins
          className="adsbygoogle block"
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
