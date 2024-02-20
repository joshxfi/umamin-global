"use client";

import dynamic from "next/dynamic";
import { TopPosts } from "@/components/posts/top";
import { LatestPosts } from "@/components/posts/latest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdSense = dynamic(() => import("@/components/adsense"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      {/* umg-feed */}
      <AdSense slotId="6296403271" />

      <Tabs defaultValue="latest" className="mt-8 w-full pb-24">
        <TabsList className="w-full border-b bg-transparent">
          <TabsTrigger value="latest" className="w-full">
            Latest
          </TabsTrigger>
          <TabsTrigger value="top" className="w-full">
            Top
          </TabsTrigger>
        </TabsList>

        <TabsContent value="latest">
          <LatestPosts />
        </TabsContent>

        <TabsContent value="top">
          <TopPosts />
        </TabsContent>
      </Tabs>
    </main>
  );
}
