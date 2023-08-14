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
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ipcRenderer } from "electron";

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

  const handleSelectFolder = async () => {
    ipcRenderer.send("select-folder");

    ipcRenderer.on("select-folder-return", (event, data) => {
      console.log(data);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {reply.data.name}
      </h1>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {reply.data.description}
      </h3>
      <div>
        <Select onValueChange={(val) => setBranch(val)} value={branch}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent>
            {reply.data.branches.map((it, i) => (
              <SelectItem value={it.name} key={i}>
                {it.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => handleSelectFolder()}></Button>
      </div>
      <DashboardVersions branchName={branch} projectId={params.projectId} />
      <Link href={`/app/projects/${params.projectId}/${branch}/create`}>
        <Button>Create new version</Button>
      </Link>
    </div>
  );
}
