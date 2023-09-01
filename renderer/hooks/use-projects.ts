import { StdReply } from "@/lib/stdReply";
import { Project } from "@/lib/types";
import { api } from "@/lib/utils";
import axios from "axios";
import useSWR from "swr";

const fetcher = (url: string) =>
  axios
    .get(url, {
      withCredentials: true,
    })
    .then((res) => res.data);

export function useProjects() {
  const { data, error, isLoading } = useSWR<StdReply<Project[]>>(
    api("/projects"),
    fetcher
  );

  return { reply: data, error, isLoading };
}
