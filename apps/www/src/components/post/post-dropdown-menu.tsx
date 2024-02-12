"use client";

import React, { useRef } from "react";
import { toast } from "sonner";
import { Icons } from "../icons";
import { useSession } from "next-auth/react";
import { useMutation } from "@apollo/client";
import { gql } from "@umamin-global/codegen/__generated__/";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePostStore } from "@/store/usePostStore";
import { ConfirmButton } from "../confirm-button";

type PostDropdownMenuProps = {
  postId: string;
  postAuthor: string;
};

type PostMenu = {
  title: string;
  onClick?: () => void;
  className?: string;
};

const REMOVE_POST = gql(`
mutation RemovePost($postId: ID!) {
  removePost(postId: $postId)
}
`);

export function PostDropdownMenu({
  postId,
  postAuthor,
}: PostDropdownMenuProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const { data: session } = useSession();
  const [removePost] = useMutation(REMOVE_POST, {
    variables: {
      postId,
    },
  });

  const isAuthor = session?.user.id === postAuthor;
  const tempRemovePost = usePostStore((state) => state.removePost);

  const handleRemovePost = () => {
    toast.loading("Deleting post");

    removePost({
      onCompleted: () => {
        tempRemovePost(postId);
        toast.success("Post deleted");
      },
      onError: (err) => {
        console.log(err);
        toast.error("Something went wrong");
      },
    });
  };

  const featUnavailable = () => {
    toast.error("Not implemented yet");
  };

  const authorMenu: PostMenu[] = [
    {
      title: "Pin to profile",
      onClick: () => {
        featUnavailable();
      },
    },
    {
      title: "Who can reply",
      onClick: () => {
        featUnavailable();
      },
    },
    {
      title: "Hide count",
      onClick: () => {
        featUnavailable();
      },
    },
    {
      title: "Delete",
      onClick: () => ref.current?.click(),

      className: "text-red-500",
    },
  ];

  const userMenu: PostMenu[] = [
    {
      title: "Profile",
      onClick: () => {
        featUnavailable();
      },
    },
    {
      title: "Hide",
      onClick: () => {
        featUnavailable();
      },
    },
    {
      title: "Block",
      onClick: () => {
        featUnavailable();
      },
      className: "text-red-500",
    },
    {
      title: "Report",
      onClick: () => {
        featUnavailable();
      },
      className: "text-red-500",
    },
  ];

  const dropdownMenu = isAuthor ? authorMenu : userMenu;

  return (
    <>
      <ConfirmButton
        title="Are you sure?"
        body="The post will be deleted permanently with its comments."
        onConfirm={handleRemovePost}
      >
        <button ref={ref} type="button"></button>
      </ConfirmButton>

      <DropdownMenu>
        <DropdownMenuTrigger title="post menu" className="outline-none">
          <Icons.menuDots className="h-5 w-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="font-semibold [&>*]:cursor-pointer [&>*]:border-b [&>*]:last:border-0">
          {dropdownMenu.map((item, i) => (
            <React.Fragment key={item.title}>
              <DropdownMenuItem
                onClick={item.onClick}
                className={item.className}
              >
                {item.title}
              </DropdownMenuItem>
              {i + 1 !== dropdownMenu.length && <DropdownMenuSeparator />}
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
