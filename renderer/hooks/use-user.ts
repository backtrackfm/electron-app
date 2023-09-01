import { StdReply } from "@/lib/stdReply";
import { User } from "@/lib/types";
import { api, fetcher } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

export function useUser() {
  const { data, error, isLoading } = useSWR<StdReply<User>>(
    api("/users"),
    fetcher
  );
  const router = useRouter();

  useEffect(() => {
    if (!data && !error && !isLoading) {
      // toast.error("You must sign in to see this page");

      return router.push("/home");
    }
  }, [data, isLoading]);

  return { reply: data, error, isLoading };
}
