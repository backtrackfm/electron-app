"use client";

import { useContext } from "react";
import { UserContext } from "../../layout";
import { CreateProjectForm } from "@/components/forms/create-project-form";

export default function CreateProjectPage() {
  const user = useContext(UserContext);

  return (
    <div className="flex flex-col w-full px-20 py-5">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-10">
        Create Project
      </h1>
      <CreateProjectForm />
    </div>
  );
}
