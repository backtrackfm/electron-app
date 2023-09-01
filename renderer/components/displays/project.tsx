import { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Tag from "../tag";

interface ProjectDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  project: Project;
}

export function ProjectDisplay({ project, className }: ProjectDisplayProps) {
  return (
    <Link href={`/app/projects/${project.id}`}>
      <div className={cn("bg-zinc-900 rounded-md px-4 py-4", className)}>
        {project.coverArtURL && (
          <div className="w-16 h-16 relative">
            <Image
              src={project.coverArtURL}
              className="object-cover"
              alt="Cover Art"
              fill={true}
            />
          </div>
        )}
        <h2 className="scroll-m-20 font-semibold tracking-tight transition-colors first:mt-0">
          {project.name}
        </h2>
        <div className="flex gap-2">
          {project.tags.map((it) => (
            <Tag name={it} />
          ))}
        </div>
      </div>
    </Link>
  );
}
