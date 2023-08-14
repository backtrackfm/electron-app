"use client";

import { VersionWithPreview } from "@/components/dashboard-versions";
import Tag from "@/components/tag";
import { Button } from "@/components/ui/button";
import { Preview } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { DownloadCloud, Play } from "lucide-react";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type VersionWithPreviewWithExtras = VersionWithPreview & {
  number: number;
};

export const columns: ColumnDef<VersionWithPreviewWithExtras>[] = [
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
        <div className="inline-flex">
          {tags.map((it) => (
            <Tag name={it} />
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
        <div className="inline-flex">
          {previews.map((it) => (
            <Link href={it.fileURL ?? ""} key={it.id}>
              <div className="bg-zinc-900 rounded-sm px-3 flex gap-1 items-center">
                <Play className="w-3" />
                {it.title}
              </div>
            </Link>
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
            <DropdownMenuItem>
              <Link
                href={filesURL ?? ""}
                className={cn(
                  "flex items-center gap-2",
                  filesURL === undefined && "cursor-not-allowed"
                )}
              >
                <DownloadCloud className="w-4 h-4" /> Download project files
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
