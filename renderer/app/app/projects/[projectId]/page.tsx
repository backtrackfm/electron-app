"use client";

import { BranchBox } from "@/components/branch-box";
import { DashboardVersions } from "@/components/dashboard-versions";
import { Button } from "@/components/ui/button";
import { getProjectSpace, saveProjectSpace } from "@/lib/localstorage-utils";
import { StdReply } from "@/lib/stdReply";
import { Branch, Project } from "@/lib/types";
import { api, fetcher, prepare } from "@/lib/utils";
import axios from "axios";
import { ipcRenderer } from "electron";
import { FolderHeart, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

export default function ViewProject({
  params,
}: {
  params: { projectId: string };
}) {
  const router = useRouter();
  const [branch, setBranch] = useState<string | null>(null);
  const [projectSpace, setProjectSpace] = useState<string>(
    getProjectSpace(params.projectId).spacePath
  );

  // Project space effect
  useEffect(() => {
    let id: string;

    if (projectSpace.length === 0) {
      id = toast.error("Project space is not selected");
    } else {
      toast.dismiss(id);
    }
  }, [projectSpace]);

  // TODO: Fix typings
  const {
    data: projectWithBranches,
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

  if (!projectWithBranches) {
    router.push("/home");
    return null;
  }

  const handleSelectFolder = async () => {
    ipcRenderer.send("select-folder");

    ipcRenderer.on("select-folder-return", (event, data) => {
      let path = "";

      if (data && data.length > 0) {
        path = data[0];
      }

      setProjectSpace(data);
      saveProjectSpace(params.projectId, path);

      ipcRenderer.removeAllListeners("select-folder-return");
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        {projectWithBranches.data.name}
      </h1>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {projectWithBranches.data.description}
      </h3>
      <div className="flex gap-2">
        <BranchBox
          branches={projectWithBranches.data?.branches ?? []}
          branch={branch}
          setBranch={(val) => setBranch(val)}
          onCreate={(it) => {
            prepare(
              () =>
                axios.post(api(`/projects/${params.projectId}/branches`), it, {
                  withCredentials: true,
                }),
              {
                successFn: () => {
                  toast.success("Created branch");
                },
                showMessages: true,
              }
            );
          }}
          onDelete={(it) => {
            prepare(
              () =>
                axios.delete(
                  api(`/projects/${params.projectId}/branches/${it.name}`),
                  {
                    withCredentials: true,
                  }
                ),
              {
                successFn: () => {
                  toast.success("Deleted branch");
                },
                showMessages: true,
              }
            );
          }}
          onEdit={(branch, newBranch) => {
            prepare(
              () =>
                axios.patch(
                  api(`/projects/${params.projectId}/branches/${branch.name}`),
                  {
                    name: newBranch.name,
                    description:
                      newBranch.description.trim() === ""
                        ? undefined
                        : newBranch.description, // TODO: fix
                  },
                  {
                    withCredentials: true,
                  }
                ),
              {
                successFn: () => {
                  toast.success("Updated branch");
                },
                showMessages: true,
              }
            );
          }}
        />
        <Button
          onClick={() => handleSelectFolder()}
          variant={projectSpace.length === 0 ? "destructive" : "outline"}
        >
          <FolderHeart className="w-4 h-4 mr-2" />
          Select project space{" "}
          {projectSpace &&
            projectSpace.length > 0 &&
            `(currently ${projectSpace.toString().split("/").at(-1)})`}
        </Button>
      </div>
      <DashboardVersions branchName={branch} projectId={params.projectId} />

      <Link href={`/app/projects/${params.projectId}/${branch}/create`}>
        <Button>Create new version</Button>
      </Link>
    </div>
  );
}
