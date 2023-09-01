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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/hooks/use-user";
import { api, prepare } from "@/lib/utils";
import { blankable } from "@/schema/schemaUtils";
import { editUserSchema } from "@/schema/usersSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type SettingsProps = {};

const formSchema = z.object({
  name: z.string().min(3),
  email: z.string().email().min(3),
  newPassword: blankable(z.string().min(6)),
  currentPassword: z.string().min(6),
  type: z.enum(["ARTIST", "PRODUCER", "ENGINEER"]).default("ARTIST"),
});

export default function SettingsPage(props: SettingsProps) {
  const { reply, isLoading, error } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      currentPassword: "",
    },
  });

  useEffect(() => {
    if (!reply) return;

    form.setValue("name", reply.data.name);
    form.setValue("email", reply.data.email);
    form.setValue("type", reply.data.type);
  }, [reply]);

  if (isLoading) {
    return <Loader className="animate-spin" />;
  }

  if (error) {
    return error;
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    prepare(
      () =>
        axios.patch(
          api(`/users`),
          {
            password: values.currentPassword,
            email: values.email,
            name: values.name,
            newPassword:
              values.newPassword?.trim().length === ""
                ? undefined
                : values.newPassword,
            type: values.type,
          } satisfies z.infer<typeof editUserSchema>,
          {
            withCredentials: true,
          }
        ),
      {
        successFn: () => toast.success("Updated user"),
      }
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
        Settings
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Myrin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="hey@7ika.dev" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Type</FormLabel>
                <FormControl>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ARTIST">Artist</SelectItem>
                        <SelectItem value="PRODUCER">Producer</SelectItem>
                        <SelectItem value="ENGINEER">Engineer</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password (optional)</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
