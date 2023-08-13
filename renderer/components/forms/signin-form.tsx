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
import { useState } from "react";
import { STD_STRING } from "@/schema/schemaUtils";
import { api, cn } from "@/lib/utils";
import axios, { AxiosError } from "axios";
import { StdReply, isStdReply } from "@/lib/stdReply";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface SigninFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const signInSchema = z.object({
  email: STD_STRING.email(),
  password: STD_STRING.max(16),
});

export function SigninForm({ className, ...props }: SigninFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setIsLoading(true);

    axios
      .post(api("/users/signin"), values, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        withCredentials: true,
      })
      .then(() => router.push("/app/dashboard"))
      .catch(() => toast.error("Error whilst signing in - check your details"));

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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="welcome@backtrack.com"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign in</Button>
      </form>
    </Form>
  );
}
