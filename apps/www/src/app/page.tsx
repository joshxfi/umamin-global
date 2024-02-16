"use client";

import { useEffect, useState } from "react";

import { TopPosts } from "@/components/posts/top";
import { LatestPosts } from "@/components/posts/latest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <Tabs defaultValue="latest" className="mt-8 w-full">
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
    )
  );
}
