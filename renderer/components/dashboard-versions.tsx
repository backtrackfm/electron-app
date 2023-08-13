import { StdReply } from "@/lib/stdReply";
import { Version } from "@/lib/types";
import { api, fetcher } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import { VersionDisplay } from "./displays/verison";

interface DashboardVersionsProps extends React.HTMLAttributes<HTMLDivElement> {
  branchName: string;
  projectId: string;
}

export function DashboardVersions(props: DashboardVersionsProps) {
  // TODO: Fix typings
  const {
    data: reply,
    error,
    isLoading,
  } = useSWR<StdReply<Version[]>>(
    api(`/projects/${props.projectId}/branches/${props.branchName}/versions`),
    fetcher
  );

  if (isLoading) {
    return <Loader className="animate-spin" />;
  }

  if (error) {
    return error;
  }

  // if (!reply) {
  //   router.push("/home");
  //   return null;
  // }

  return (
    <div>
      {reply.data
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((it, i) => (
          <VersionDisplay num={reply.data.length - i} version={it} />
        ))}
    </div>
  );
}
