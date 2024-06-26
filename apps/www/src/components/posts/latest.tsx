import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { gql } from "@umamin-global/codegen/generated";
import { useInView } from "react-intersection-observer";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Post } from "@/components/post/post";
import { usePostStore } from "@/store/usePostStore";
import FeedLoading from "@/components/post/feed-loading";

const AdSense = dynamic(() => import("@/components/adsense"), {
  ssr: false,
});

const GET_POSTS = gql(`
query GetLatestPosts($cursorId: ID) {
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
        image
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

export function LatestPosts() {
  const router = useRouter();
  const { ref, inView } = useInView();
  const { data: session, status } = useSession();
  const { data, loading, fetchMore } = useQuery(GET_POSTS);
  const tempPosts = usePostStore((state) => state.posts);
  const removedPosts = usePostStore((state) => state.removedPosts);

  useEffect(() => {
    if (inView && data && data.getPosts.cursorId) {
      fetchMore({
        variables: {
          cursorId: data?.getPosts.cursorId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  if (loading || status === "loading") {
    return <FeedLoading />;
  }

  if (session?.user && !session?.user.username) {
    router.push("/new-user");
  }

  return (
    <section>
      {Object.entries(tempPosts)
        .filter(([_, m]) => !removedPosts.includes(m.id))
        .reverse()
        .map(([_, m]) => (
          <Post type="post" key={m.id} {...m} />
        ))}

      {data?.getPosts.data
        ?.filter((m) => !removedPosts.includes(m.id))
        .map((m, i) => (
          <div key={m.id}>
            {/* umg-posts */}
            {(i + 1) % 5 === 0 && <AdSense slotId="1301793554" />}

            <Post type="post" {...m} />
          </div>
        ))}

      {!!data?.getPosts.data && data.getPosts.data.length >= 10 && (
        <div ref={ref}></div>
      )}
    </section>
  );
}
