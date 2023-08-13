"use client";

import axios from "axios";
import { api } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/use-user";
import { DashboardProjects } from "@/components/dashboard-projects";

export default function Test() {
  const { reply, error, isLoading } = useUser();
  const router = useRouter();

  return (
    <>
      {!isLoading && reply && reply.data ? (
        <>
          <div className="h-screen flex">
            <div className="w-1/4 min-w-[250px] bg-zinc-900 py-10 px-8 h-full">
              <div className="mt-1 w-full flex-wrap inline-flex justify-center flex-col">
                {reply.data.name}
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
            </div>
            <div className="my-10 mx-20 w-full">
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-10">
                {reply.data.name}
              </h1>
              <DashboardProjects />
            </div>
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
