"use client";

import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import React from "react";
import { useSession } from "next-auth/react";
import { Icons } from "../icons";

type PostDropdownMenuProps = {
  postId: string;
  postAuthor: string;
};

export function PostDropdownMenu({ postAuthor }: PostDropdownMenuProps) {
  const { data: session } = useSession();

  const isAuthor = session?.user.id === postAuthor;

  type PostMenu = {
    title: string;
    onClick?: () => void;
    className?: string;
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
      onClick: () => {
        featUnavailable();
      },
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

  return (
    <>
      {isAuthor ? (
        <DropdownMenu>
          <DropdownMenuTrigger title="post menu" className="outline-none">
            <Icons.menuDots className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="font-semibold [&>*]:cursor-pointer">
            {authorMenu.map((item, i) => (
              <React.Fragment key={item.title}>
                <DropdownMenuItem
                  onClick={item.onClick}
                  className={item.className}
                >
                  {item.title}
                </DropdownMenuItem>
                {i + 1 !== authorMenu.length && <DropdownMenuSeparator />}
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Icons.menuDots className="h-4 w-4 text-2xl" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="font-semibold [&>*]:cursor-pointer [&>*]:border-b [&>*]:last:border-0">
            {userMenu.map((item, i) => (
              <React.Fragment key={item.title}>
                <DropdownMenuItem
                  onClick={item.onClick}
                  className={item.className}
                >
                  {item.title}
                </DropdownMenuItem>
                {i + 1 !== userMenu.length && <DropdownMenuSeparator />}
              </React.Fragment>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
