"use client";

import axios from "axios";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { api } from "@/lib/utils";
import toast from "react-hot-toast";
import { User } from "@/lib/types";
import Link from "next/link";

interface DashboardSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  user: User;
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const router = useRouter();

  return (
    <div className="w-1/4 min-w-[250px] bg-zinc-900 py-10 px-8 h-full">
      <div className="mt-1 w-full flex-wrap inline-flex justify-center flex-col">
        {user.name}
        <Button
          onClick={() => {
            axios
              .post(api("/users/signout"), null, {
                withCredentials: true,
              })
              .then(() => router.push("/home"))
              .catch(() => toast.error("error"));
          }}
        >
          Log out
        </Button>
        <Link href="/app/dashboard">Dashboard</Link>
      </div>
    </div>
  );
}
