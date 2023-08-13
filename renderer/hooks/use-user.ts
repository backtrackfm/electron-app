import { StdReply } from "@/lib/stdReply";
import { User } from "@/lib/types";
import { api } from "@/lib/utils";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

const fetcher = (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
    })
    .then((res) => res.data);

export function useUser() {
  const { data, error, isLoading } = useSWR<StdReply<User>, AxiosError>(
    api("/users"),
    fetcher
  );
  const router = useRouter();

  useEffect(() => {
    if (!data && !isLoading) {
      toast.error("You must sign in to see this page");
      return router.push("/home");
    }
  }, [data, isLoading]);

  return { reply: data, error, isLoading };
}
