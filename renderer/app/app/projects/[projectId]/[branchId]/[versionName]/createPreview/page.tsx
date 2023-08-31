"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api, prepare } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(3),
});

type CreatePreviewProps = {
  params: {
    projectId: string;
    branchId: string;
    versionName: string;
  };
};

export default function CreatePreviewPage({ params }: CreatePreviewProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const [file, setFile] = useState<File | null>(null);

  async function submit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();

    if (!file) return toast.error("No file provided");

    formData.append("preview", file);
    formData.append("body", JSON.stringify(values));

    await prepare(
      () =>
        axios.post(
          api(
            `/projects/${params.projectId}/branches/${params.branchId}/versions/${params.versionName}/previews`
          ),
          formData,
          {
            withCredentials: true,
          }
        ),
      {
        showMessages: true,
        successFn: () => {
          toast.success("Created preview");
        },
      }
    );
  }

  return (
    <div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Create Preview
      </h1>
      <p className="leading-7 text-muted-foreground">
        You are creating a preview for version "{params.versionName}"
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(submit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="vocals" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>Audio</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="audio/*"
                multiple={false}
                onChange={(e) =>
                  e.target.files.length > 0 && setFile(e.target.files[0])
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>

          <Button type="submit">Create preview</Button>
        </form>
      </Form>
    </div>
  );
}
