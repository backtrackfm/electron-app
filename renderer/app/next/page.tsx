"use client";

import "../globals.css";

import useSWR from "swr";
import axios from "axios";
import { api } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { StdReply } from "@/lib/stdReply";
import { useEffect } from "react";
import { useUser } from "@/hooks/use-user";

export default function Test() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  return (
    <>
      <div className="grid grid-col-1 text-2xl w-full text-center">
        <img className="ml-auto mr-auto" src="/images/logo.png" />
        <span>BACKTRACK</span>
      </div>
      {!isLoading && user ? (
        <>
          <div className="mt-1 w-full flex-wrap inline-flex justify-center flex-col">
            Hello {user.data && user.data.name}
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
