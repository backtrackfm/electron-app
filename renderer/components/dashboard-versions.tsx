import { StdReply } from "@/lib/stdReply";
import { Preview, Version } from "@/lib/types";
import { api, fetcher } from "@/lib/utils";
import { Loader } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import { VersionDisplay } from "./displays/version";
import { DataTable } from "./tables/versions/data-table";
import { columns } from "./tables/versions/columns";

interface DashboardVersionsProps extends React.HTMLAttributes<HTMLDivElement> {
  branchName: string;
  projectId: string;
}

export type VersionWithPreview = Version & {
  preview: Preview;
};

export function DashboardVersions(props: DashboardVersionsProps) {
  // TODO: Fix typings
  const {
    data: reply,
    error,
    isLoading,
  } = useSWR<StdReply<VersionWithPreview[]>>(
    api(`/projects/${props.projectId}/branches/${props.branchName}/versions`),
    fetcher
  );

  if (isLoading) {
    return <Loader className="animate-spin" />;
  }

  if (error) {
    return error;
  }

  return (
    <div>
      <DataTable
        columns={columns}
        data={reply.data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )}
      />
    </div>
  );
}
