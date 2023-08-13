import { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProjectDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  project: Project;
}

export function ProjectDisplay({ project, className }: ProjectDisplayProps) {
  return (
    <div className={cn("bg-zinc-900 rounded-md", className)}>
      {project.coverArtURL && (
        <div className="w-16 h-16 relative">
          <Image src={project.coverArtURL} alt="Cover Art" fill={true} />
        </div>
      )}
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        {project.name}
      </h2>
      {/* <h1>{project.description}</h1> */}
      <h1>{project.tags}</h1>
    </div>
  );
}
