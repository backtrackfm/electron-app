"use client";

import "../globals.css";

import useSWR from "swr";
import axios from "axios";
import { api } from "@/lib/utils";
import { Loader, LoaderIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const fetcher = (url) =>
  axios
    .get(url, {
      withCredentials: true,
    })
    .then((res) => res.data);

export default function Test() {
  const { data, error, isLoading } = useSWR(
    "http://localhost:4000/api/users",
    fetcher
  );

  return (
    <>
      <div className="grid grid-col-1 text-2xl w-full text-center">
        <img className="ml-auto mr-auto" src="/images/logo.png" />
        <span>⚡ Nextron ⚡. Only super cool people can see this</span>
      </div>
      {!isLoading && data ? (
        <>
          <div className="mt-1 w-full flex-wrap flex justify-center">
            Hello {data && data.data.name}
          </div>
        </>
      ) : (
        <>
          <Skeleton className="h-4 w-[250px]" />
        </>
      )}
    </>
  );
}
