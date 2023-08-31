import { StdReply } from "@/lib/stdReply";
import { Preview, Version } from "@/lib/types";
import { api, fetcher } from "@/lib/utils";
import { Loader } from "lucide-react";
import useSWR from "swr";
import { getColumns } from "./tables/versions/columns";
import { DataTable } from "./tables/versions/data-table";
import { useContext } from 'react';
import { PlaybarContext } from '@/app/app/projects/[projectId]/layout';

interface DashboardVersionsProps extends React.HTMLAttributes<HTMLDivElement> {
  branchName: string;
  projectId: string;
}

export type VersionWithPreview = Version & {
  preview: Preview;
};

export function DashboardVersions(props: DashboardVersionsProps) {
  const playbarContext = useContext(PlaybarContext);

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
        columns={getColumns(props.projectId, props.branchName, playbarContext)}
        data={reply.data
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((it, i) => {
            return {
              ...it,
              number: reply.data.length - i,
            };
          })}
      />
    </div>
  );
}
