"use client";

import { CreateVersionForm } from "@/components/forms/create-version-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProjectSpace } from "@/lib/localstorage-utils";
import { StdReply } from "@/lib/stdReply";
import { Version } from "@/lib/types";
import { api, fetcher, formatTimeDuration } from "@/lib/utils";
import { ipcRenderer } from "electron";
import { Stats } from "fs";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";

export type SystemFile = {
  path: string;
  stats: Stats;
  file: File;
};

function findLatestModifiedFile(files: SystemFile[]): SystemFile | null {
  console.log(files);
  if (files.length === 0) {
    return null; // Return null if the array is empty
  }

  return files.reduce((latestFile, file) =>
    file.stats.mtime.getTime() > latestFile.stats.mtime.getTime()
      ? file
      : latestFile
  );
}

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
  const [latestModifiedDate, setLatestModifiedDate] = useState<Date | null>(
    null
  );
  const [modifiedFiles, setModifiedFiles] = useState<SystemFile[]>([]);
  const {
    data: reply,
    error,
    isLoading,
  } = useSWR<StdReply<Version>>(
    api(
      `/projects/${params.projectId}/branches/${params.branchId}/versions/latest`
    ),
    (url) => fetcher(url, false), // don't show messages
    {
      shouldRetryOnError: false,
    }
  );

  const handleRefresh = async () => {
    // If there isn't a previous version, then we want to just
    if (!reply) {
      ipcRenderer.send(
        "spaces:get-changes-made",
        projectSpace,
        new Date(0, 1, 1)
      );
    } else {
      ipcRenderer.send(
        "spaces:get-changes-made",
        projectSpace,
        reply.data.createdAt
      );
    }

    ipcRenderer.on(
      "spaces:get-changes-made/return",
      (event, modifiedFiles: SystemFile[]) => {
        setModifiedFiles(modifiedFiles);
        setLatestModifiedDate(
          findLatestModifiedFile(modifiedFiles)?.stats.mtime
        );
      }
    );
  };

  return (
    <div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Create Version
      </h1>
      <p className="leading-7 text-muted-foreground">
        You are creating a new version on the "{params.branchId}" branch
      </p>
      <Separator className="my-4" />
      <div className="flex items-center gap-3 mb-10">
        <Button onClick={() => handleRefresh()}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          Check changes
        </Button>
        <p>
          {latestModifiedDate
            ? `Changes made ${formatTimeDuration(
                new Date().getTime() - latestModifiedDate.getTime()
              )} ago`
            : `No changes made`}
        </p>
      </div>

      <CreateVersionForm
        branchId={params.branchId}
        projectId={params.projectId}
        disabled={modifiedFiles.length === 0}
        modifiedFiles={modifiedFiles}
      />
    </div>
  );
}
