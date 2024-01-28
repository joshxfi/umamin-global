import { create } from "zustand";
import { PostData } from "@/types";
import { immer } from "zustand/middleware/immer";
import { AddPostMutation } from "@umamin-global/codegen/__generated__/graphql";

type UpdateData<T> = (postId: string, data: T) => void;

type State = {
  posts: Record<string, PostData>;
  comments: Record<string, Record<string, Omit<PostData, "comments">>>;
  upvotes: Record<string, string>;
  tags: Record<string, Record<string, boolean>>;
  removedPosts: string[];
};

type Action = {
  addPost: (postData: AddPostMutation["addPost"]) => void;
  updateComments: UpdateData<Omit<PostData, "comments">>;
  updateUpvotes: UpdateData<string>;
  updateTags: UpdateData<{ name: string; hide: boolean }>;
  removePost: (postId: string) => void;
};

export const usePostStore = create<State & Action>()(
  immer((set) => ({
    posts: {},
    comments: {},
    upvotes: {},
    tags: {},
    removedPosts: [],

    addPost: (postData) =>
      set((state) => {
        state.posts[postData.id] = {
          ...postData,
        };
      }),

    removePost: (postId) =>
      set((state) => {
        state.removedPosts.push(postId);
      }),

    updateComments: (postId, commentData) =>
      set((state) => {
        state.comments[postId] = {
          [commentData.id]: commentData,
        };
      }),

    updateUpvotes: (postId, upvoteId) =>
      set((state) => {
        state.upvotes[postId] = upvoteId;
      }),

    updateTags: (postId, tag) =>
      set((state) => {
        state.tags[postId] = {
          ...state.tags[postId],
          [tag.name]: tag.hide,
        };
      }),
  }))
);
