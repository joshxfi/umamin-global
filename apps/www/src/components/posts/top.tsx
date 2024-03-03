import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useInView } from "react-intersection-observer";
import { gql } from "@umamin-global/codegen/generated";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";

import { Post } from "@/components/post/post";
import { usePostStore } from "@/store/usePostStore";
import FeedLoading from "@/components/post/feed-loading";

const AdSense = dynamic(() => import("@/components/adsense"), {
  ssr: false,
});

const GET_TOP_POSTS = gql(`
query GetTopPosts($cursorId: ID) {
  getTopPosts(cursorId: $cursorId) {
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

export function TopPosts() {
  const router = useRouter();
  const { ref, inView } = useInView();
  const { data: session, status } = useSession();
  const { data, loading, fetchMore } = useQuery(GET_TOP_POSTS);
  const removedPosts = usePostStore((state) => state.removedPosts);

  useEffect(() => {
    if (inView && data && data.getTopPosts.cursorId) {
      fetchMore({
        variables: {
          cursorId: data?.getTopPosts.cursorId,
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
      {data?.getTopPosts.data
        ?.filter((m) => !removedPosts.includes(m.id))
        .map((m, i) => (
          <div key={m.id}>
            {/* umg-posts */}
            {(i + 1) % 5 === 0 && <AdSense slotId="1301793554" />}

            <Post type="post" {...m} />
          </div>
        ))}

      {!!data?.getTopPosts.data && data.getTopPosts.data.length >= 10 && (
        <div ref={ref}></div>
      )}
    </section>
  );
}
