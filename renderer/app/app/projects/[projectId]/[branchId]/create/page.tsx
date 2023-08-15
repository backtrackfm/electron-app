"use client";

import { CreateVersionForm } from "@/components/forms/create-version-form";
import { Button } from "@/components/ui/button";
import { getProjectSpace } from "@/lib/localstorage-utils";
import { ipcRenderer } from "electron";
import { useState } from "react";

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

  const handleRefresh = async () => {
    ipcRenderer.send(
      "spaces:get-changes-made",
      projectSpace,
      new Date("1-1-19")
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
