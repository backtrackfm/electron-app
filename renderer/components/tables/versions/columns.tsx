"use client";

import { PlaybarContextValue } from "@/app/app/projects/[projectId]/layout";
import { VersionWithPreview } from "@/components/dashboard-versions";
import Tag from "@/components/tag";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getProjectSpace } from "@/lib/localstorage-utils";
import { Preview } from "@/lib/types";
import { api, formatDate, prepare } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import electron from "electron";
import { DownloadCloud, Eye, MoreHorizontal, Play, Trash } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ProjectFilesDownloadInfo } from "../../../../main/background";

type VersionWithPreviewWithExtras = VersionWithPreview & {
  number: number;
};

export function getColumns(
  projectId: string,
  branchName: string,
  playbarContext: PlaybarContextValue,
  onDelete: (name: string) => void
): ColumnDef<VersionWithPreviewWithExtras>[] {
  return [
    {
      accessorKey: "number",
      header: "Number",
      cell: ({ row }) => {
        return <span>#{row.getValue("number")}</span>;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        const tags: string[] = row.getValue("tags");

        return (
          <div className="inline-flex gap-2">
            {tags.map((it, i) => (
              <Tag key={i} name={it} />
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "previews",
      header: "Previews",
      cell: ({ row }) => {
        const previews: (Preview | undefined)[] = row.getValue("previews");

        return (
          <div className="inline-flex gap-2">
            {previews.map((it) => (
              <Button
                className="rounded-sm px-3 flex gap-1 items-center"
                variant="ghost"
                onClick={() => playbarContext.setPlaybarURL(it.fileURL ?? null)}
              >
                {playbarContext.playbarURL === it.fileURL ? (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                ) : (
                  <Play className="w-4" />
                )}
                {it.title}
              </Button>
            ))}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        return formatDate(new Date(row.getValue("createdAt")));
      },
    },
    {
      accessorKey: "filesURL",
      enableHiding: false,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const filesURL: string = row.getValue("filesURL");
        const name: string = row.getValue("name");
        const ipcRenderer = electron.ipcRenderer || false;

        function downloadFiles() {
          if (!ipcRenderer) return;
          ipcRenderer.send("projectFiles:download", {
            url: filesURL,
            properties: {
              directory: getProjectSpace(projectId).spacePath ?? undefined,
              filename: `${name
                .toLowerCase()
                .replace(/ /g, "-")}-project-files.zip`,
            },
          } satisfies ProjectFilesDownloadInfo);

          ipcRenderer.on("projectFiles:download/success", (event, file) => {
            toast.success("Downloaded file");
            ipcRenderer.removeAllListeners("projectFiles:download/success");
          });
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={downloadFiles}>
                <DownloadCloud className="w-4 h-4 mr-2" /> Download project
                files
              </DropdownMenuItem>
              <Link
                href={`/app/projects/${projectId}/${branchName}/${name}/createPreview`}
              >
                <DropdownMenuItem>
                  <Eye className="w-4 h-4 mr-2" /> Add preview
                </DropdownMenuItem>
              </Link>

              <DropdownMenuItem
                className="text-destructive"
                onClick={() =>
                  prepare(() =>
                    axios.delete(
                      api(
                        `/projects/${projectId}/branches/${branchName}/versions/${name}`
                      ),
                      {
                        withCredentials: true,
                      }
                    )
                  ).then(() => onDelete(name))
                }
              >
                <Trash className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
