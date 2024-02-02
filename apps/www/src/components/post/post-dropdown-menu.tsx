"use client";

import React from "react";
import { toast } from "sonner";
import { Icons } from "../icons";
import { useSession } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const dropdownMenu = isAuthor ? authorMenu : userMenu;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger title="post menu" className="outline-none">
        <Icons.menuDots className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="font-semibold [&>*]:cursor-pointer [&>*]:border-b [&>*]:last:border-0">
        {dropdownMenu.map((item, i) => (
          <React.Fragment key={item.title}>
            <DropdownMenuItem onClick={item.onClick} className={item.className}>
              {item.title}
            </DropdownMenuItem>
            {i + 1 !== dropdownMenu.length && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
