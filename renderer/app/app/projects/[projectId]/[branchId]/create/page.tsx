"use client";

import { CreateVersionForm } from "@/components/forms/create-version-form";
import { Button } from "@/components/ui/button";
import { getProjectSpace } from "@/lib/localstorage-utils";
import { StdReply } from "@/lib/stdReply";
import { Version } from "@/lib/types";
import { api, fetcher } from "@/lib/utils";
import { ipcRenderer } from "electron";
import { useState } from "react";
import useSWR from "swr";

export default function CreateVersionPage({
  params,
}: {
  params: {
    projectId: string;
    branchId: string;
  };
}) {
  const [projectSpace, setProjectSpace] = useState<string>(
    getProjectSpace(params.projectId).spacePath
  );
  const [modifiedFiles, setModifiedFiles] = useState<File[]>([]);
  const {
    data: reply,
    error,
    isLoading,
  } = useSWR<StdReply<Version>>(
    api(
      `/projects/${params.projectId}/branches/${params.branchId}/versions/latest`
    ),
    (url) => fetcher(url, false) // don't show messages
  );

  if (!reply) {
    return null;
  }

  const handleRefresh = async () => {
    if (!reply) return;

    ipcRenderer.send(
      "spaces:get-changes-made",
      projectSpace,
      reply.data.createdAt
    );

    ipcRenderer.on(
      "spaces:get-changes-made/return",
      (event, modifiedFiles: File[]) => {
        console.log(modifiedFiles);
        setModifiedFiles(modifiedFiles);
      }
    );
  };

  return (
    <div>
      <Button onClick={() => handleRefresh()}>Refresh</Button>
      <CreateVersionForm
        branchId={params.branchId}
        projectId={params.projectId}
        disabled={modifiedFiles.length === 0}
        modifiedFiles={modifiedFiles}
      />
    </div>
  );
}
