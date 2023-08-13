"use client";

import { ProjectDisplay } from "./displays/project";
import { Skeleton } from "./ui/skeleton";
import { useProjects } from "@/hooks/use-projects";
import React from "react";

export function DashboardProjects() {
  const { reply, error, isLoading } = useProjects();

  return (
    <>
      {!isLoading && reply && reply.data ? (
        <div className="flex flex-col w-full gap-4">
          {reply.data.map((project) => (
            <ProjectDisplay project={project} />
          ))}
        </div>
      ) : (
        <Skeleton />
      )}
    </>
  );
}
