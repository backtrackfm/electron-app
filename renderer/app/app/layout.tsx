"use client";

import { useUser } from "@/hooks/use-user";
import { User } from "@/lib/types";
import { LoaderIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { createContext } from "react";

export const UserContext = createContext<User | null>(null);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { reply, error, isLoading } = useUser();

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
    <UserContext.Provider value={reply.data}>{children}</UserContext.Provider>
  );
}
