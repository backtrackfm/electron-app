"use client";

import { StdReply } from "@/lib/stdReply";
import { Branch, Project } from "@/lib/types";
import { api, fetcher } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { DashboardVersions } from "@/components/dashboard-versions";

export default function ViewProject({
  params,
}: {
  params: { projectId: string };
}) {
  const router = useRouter();
  const [branch, setBranch] = useState<string>("main");

  // TODO: Fix typings
  const {
    data: reply,
    error,
    isLoading,
  } = useSWR<StdReply<Project & { branches: Branch[] }>>(
    api(`/projects/${params.projectId}`),
    fetcher
  );

  if (isLoading) {
    return <Loader className="animate-spin" />;
  }

  if (error) {
    return error;
  }

  if (!reply) {
    router.push("/home");
    return null;
  }

  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {reply.data.name}
      </h1>
      <Select onValueChange={(val) => setBranch(val)} value={branch}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Branch" />
        </SelectTrigger>
        <SelectContent>
          {reply.data.branches.map((it) => (
            <SelectItem value={it.name}>{it.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <h1>{branch}</h1>
      <DashboardVersions branchName={branch} projectId={params.projectId} />
    </>
  );
}
