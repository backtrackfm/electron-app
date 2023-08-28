"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { User } from "@/lib/types";
import { api } from "@/lib/utils";
import axios from "axios";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext } from "react";
import toast from "react-hot-toast";

export const UserContext = createContext<User | null>(null);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { reply, error, isLoading } = useUser();
  console.log(error);

  if (!reply) {
    if (!isLoading) {
      router.push("/home");
      return <div>You are not signed in</div>;
    }

    return <LoaderIcon className="animate-spin" />;
  }

  if (reply && !reply.data) {
    router.push("/home");
    return <div>No user</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <UserContext.Provider value={reply.data}>
      <>
        <div className="flex h-screen w-screen">
          <aside className="w-1/3 min-w-[300px] px-4 py-4">
            <div className="h-full flex flex-col rounded-xl">
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                {reply.data.name}
              </h3>
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
          </aside>
          <div className="w-full overflow-auto px-8 py-10">{children}</div>
        </div>
      </>
    </UserContext.Provider>
  );
}
