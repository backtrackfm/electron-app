"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import React, { useState } from "react";
import { STD_STRING } from "@/schema/schemaUtils";
import { api, cn, prepare } from "@/lib/utils";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createProjectSchema } from "@/schema/projectsSchema";
import { Label } from "../ui/label";
import Image from "next/image";
import { createVersionSchema } from "@/schema/versionsSchema";
import JSZip from "jszip";

interface CreateVersionFormProps extends React.HTMLAttributes<HTMLDivElement> {
  projectId: string;
  branchId: string;
}

export function CreateVersionForm({
  className,
  ...props
}: CreateVersionFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<FileList>();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof createVersionSchema>>({
    resolver: zodResolver(createVersionSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof createProjectSchema>) {
    setIsLoading(true);

    const formData = new FormData();

    for (const [key, value] of Object.entries(values)) {
      formData.append(key, value);
    }

    // Zip files
    const zip = new JSZip();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const fileData = await new Response(file).arrayBuffer();

      zip.file(file.name, fileData);
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
      () => {
        toast.success("Created version");
      }
    );

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <Input type="file" multiple onChange={(e) => setFiles(e.target.files)} />

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
                <Input placeholder="Real" {...field} />
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
                <Input placeholder="Optional song description" {...field} />
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
                <Input placeholder="Tags" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Create version</Button>
      </form>
    </Form>
  );
}
