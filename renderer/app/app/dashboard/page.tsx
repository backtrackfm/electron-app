"use client";

import { DashboardProjects } from "@/components/dashboard-projects";
import { Button } from "@/components/ui/button";
import { getGradient } from "@/lib/utils";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../layout";

export default function DashboardPage() {
  const user = useContext(UserContext);

  return (
    <div className="flex flex-col gap-10">
      <div className="relative overflow-hidden rounded-md">
        <h1 className="scroll-m-20 text-4xl absolute left-10 font-extrabold tracking-tight lg:text-5xl my-10">
          {user.name}
        </h1>
        <div
          className="h-32 w-full flex items-center p-10 blur-3xl animate-pulse opacity-10"
          style={{
            background: getGradient(user.name),
            animationDuration: "15000ms",
          }}
        />
      </div>

      <h1>Projects</h1>
      <DashboardProjects />
      <Link href="/app/projects/create">
        <Button>Create new project</Button>
      </Link>
    </div>
  );
}
