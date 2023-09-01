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
        <div className="absolute left-10 top-1/2 -translate-y-1/2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            {user.name}
          </h1>
          <p className="font-semibold">{user.type}</p>
        </div>

        <div
          className="h-32 w-full flex items-center p-10 blur-3xl animate-pulse opacity-10"
          style={{
            background: getGradient(user.name),
            animationDuration: "15000ms",
          }}
        />
      </div>

      <h1 className="text-lg font-medium">Your Projects</h1>
      <DashboardProjects />
      <Link href="/app/projects/create">
        <Button>Create new project</Button>
      </Link>
    </div>
  );
}
