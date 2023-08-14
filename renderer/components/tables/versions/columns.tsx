"use client";

import { VersionWithPreview } from "@/components/dashboard-versions";
import Tag from "@/components/tag";
import { Preview } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { Hash, Play } from "lucide-react";
import Link from "next/link";

export const columns: ColumnDef<VersionWithPreview>[] = [
  {
    header: "Number",
    cell: ({ row }) => {
      return <p>#{row.id}</p>;
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
];
