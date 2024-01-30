"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { gql } from "@umamin-global/codegen/__generated__";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Post } from "@/components/post/post";
import { useNanoid } from "@/hooks/use-nanoid";
import { Skeleton } from "@/components/ui/skeleton";
import { usePostStore } from "@/store/usePostStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const GET_POSTS = gql(`
query GetPosts($cursorId: ID) {
  getPosts(cursorId: $cursorId) {
    cursorId
    data {
      id
      content
      createdAt
      isAnonymous
      author {
        id
        username
      }
      tags {
        id
        name
      }
      upvotes {
        id
        userId
      }
      _count {
        comments
      }
    }
  }
}
`);

export default function Home() {
  const router = useRouter();
  const { ref, inView } = useInView();
  const { data: session, status } = useSession();
  const { data, loading, fetchMore } = useQuery(GET_POSTS);
  const tempPosts = usePostStore((state) => state.posts);
  const removedPosts = usePostStore((state) => state.removedPosts);

  const ids = useNanoid(6);

  useEffect(() => {
    if (inView) {
      fetchMore({
        variables: {
          cursorId: data?.getPosts.cursorId,
        },
      });
    }
  }, [inView, fetchMore, data?.getPosts.cursorId]);

  if (loading || status === "loading") {
    return (
      <div className="space-y-12 container">
        {Array.from({ length: 6 }).map((_, i) => (
          <div className="space-y-2" key={ids[i]}>
            <div className="flex space-x-2">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
            <Skeleton className="h-4 w-[300px]" />
          </div>
        ))}
      </div>
    );
  }

  if (session?.user && !session?.user.username) {
    router.push("/new-user");
  }

  return (
    <section className="pb-24">
      {Object.entries(tempPosts)
        .filter(([_, m]) => !removedPosts.includes(m.id))
        .reverse()
        .map(([_, m]) => (
          <Post type="post" key={m.id} {...m} />
        ))}

      {data?.getPosts.data
        ?.filter((m) => !removedPosts.includes(m.id))
        .map((m) => <Post type="post" key={m.id} {...m} />)}

      {!!data?.getPosts.data && data.getPosts.data.length >= 10 && (
        <div ref={ref}></div>
      )}
    </section>
  );
}
