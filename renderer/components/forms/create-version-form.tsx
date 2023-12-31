"use client";

import { SystemFile } from "@/app/app/projects/[projectId]/[branchId]/create/page";
import { api, cn, prepare } from "@/lib/utils";
import { createProjectSchema } from "@/schema/projectsSchema";
import { createVersionSchema } from "@/schema/versionsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import JSZip from "jszip";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { TagInput } from "../tag-input";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface CreateVersionFormProps extends React.HTMLAttributes<HTMLDivElement> {
  projectId: string;
  branchId: string;
  disabled: boolean;
  modifiedFiles: SystemFile[];
  projectSpace: string;
}

export function CreateVersionForm({
  className,
  ...props
}: CreateVersionFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [files, setFiles] = useState<File[]>();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof createVersionSchema>>({
    resolver: zodResolver(createVersionSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof createProjectSchema>) {
    if (props.modifiedFiles.length === 0) return;

    setIsLoading(true);

    const formData = new FormData();

    formData.append("body", JSON.stringify(values));

    // Zip files
    const zip = new JSZip();

    for (let i = 0; i < props.modifiedFiles.length; i++) {
      const file = props.modifiedFiles[i];
      const fileData = await new Response(file.file).arrayBuffer();

      // generate name
      const pathFragment = file.path.slice(props.projectSpace.length);

      zip.file(pathFragment, fileData);
      console.log(zip);
    }

    const zipBlob = await zip.generateAsync({
      type: "blob",
    });

    formData.append("projectFiles", zipBlob, "files.zip");

    await prepare(
      () =>
        axios.post(
          api(
            `/projects/${props.projectId}/branches/${props.branchId}/versions`
          ),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        ),
      {
        successFn: () => {
          router.push(`/app/projects/${props.projectId}`);
          toast.success("Created version");
        },
      }
    );

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex flex-col gap-4", className)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Bell" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Add new bell sound" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagInput tags={field.value} setTags={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={props.disabled}>
          Create version
        </Button>
      </form>
    </Form>
  );
}
