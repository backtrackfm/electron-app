"use client";

import { api, cn, prepare } from "@/lib/utils";
import { createProjectSchema } from "@/schema/projectsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
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

interface CreateProjectFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CreateProjectForm({
  className,
  ...props
}: CreateProjectFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File>();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      genre: "",
      description: "",
      tags: [],
    },
  });

  async function onSubmit(values: z.infer<typeof createProjectSchema>) {
    setIsLoading(true);

    const formData = new FormData();

    formData.append("body", JSON.stringify(values));

    if (file) {
      formData.append("coverArt", file);
    }

    prepare(
      () =>
        axios.post(
          api("/projects"),
          {
            body: JSON.stringify(values),
            coverArt: file,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        ),
      {
        successFn: () => {
          router.push("/app/dashboard");
          toast.success("Created project");
        },
        showMessages: true,
      }
    );

    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

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
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <FormControl>
                <Input placeholder="Hip-hop" {...field} />
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
        <Button type="submit">Create project</Button>
      </form>
    </Form>
  );
}
