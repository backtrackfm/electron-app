"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { User } from "@/lib/types";
import { api, getGradient, prepare } from "@/lib/utils";
import logo from "@/public/images/logo.svg";
import axios from "axios";
import {
  Check,
  LayoutDashboard,
  LoaderIcon,
  LogOut,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const UserContext = createContext<User | null>(null);

type Onboarding = {
  project: boolean;
  branch: boolean;
  version: boolean;
};

const countTrue = (onboarding: Onboarding) => {
  let count = 0;
  for (const [key, value] of Object.entries(onboarding)) {
    if (value) {
      count++;
    }
  }
  return count;
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { reply, error, isLoading } = useUser();

  const [onboarding, setOnboarding] = useState<Onboarding>({
    project: false,
    branch: false,
    version: false,
  });

  useEffect(() => {
    prepare(() =>
      axios.get(api("/users/onboarding"), {
        withCredentials: true,
      })
    ).then((it) => {
      if (!it) return;
      setOnboarding(it.data.data);
    });
  }, []);

  if (!reply) {
    if (!isLoading) {
      router.push("/home");
      return <div>You are not signed in</div>;
    }

    return <LoaderIcon className="animate-spin" />;
  }

  if (reply && !reply.data) {
    router.push("/home");
    return <div>No user</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <UserContext.Provider value={reply.data}>
      <>
        <div className="flex h-screen w-screen">
          <aside className="w-1/6 min-w-[300px] px-4 py-4 border-r">
            <div className="h-full flex flex-col rounded-xl justify-between">
              <div className="flex flex-col gap-16">
                <div className="relative z-20 flex items-center text-xl font-medium gap-2 w-full justify-center">
                  <Image src={logo} alt="⏮️" className="w-10 h-10" />
                  Backtrack
                </div>

                <div className="flex flex-col gap-2">
                  <div className="hover:bg-zinc-900 p-2 rounded-md">
                    <Link
                      href="/app/dashboard"
                      className="flex items-center gap-2 font-medium text-md"
                    >
                      <LayoutDashboard className="w-6 h-6" /> Dashboard
                    </Link>
                  </div>
                  <div className="hover:bg-zinc-900 p-2 rounded-md">
                    <Link
                      href="/app/settings"
                      className="flex items-center gap-2 font-medium text-md"
                    >
                      <Settings className="w-6 h-6" /> User Settings
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-zinc-900 rounded-md p-4 flex flex-col gap-3 space-evenly">
                  <div className="flex justify-between">
                    <h1 className="font-bold">Onboarding</h1>
                    <p className="text-muted-foreground">
                      {countTrue(onboarding)}/{Object.keys(onboarding).length}{" "}
                      completed
                    </p>
                  </div>
                  <hr />
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <FakeCheckbox checked={onboarding.project} />
                      Create a project
                    </div>
                    <div className="flex items-center gap-2">
                      <FakeCheckbox checked={onboarding.branch} />
                      Create a branch
                    </div>
                    <div className="flex items-center gap-2">
                      <FakeCheckbox checked={onboarding.version} />
                      Create a version
                    </div>
                  </div>
                  <div className="w-full bg-background h-2 rounded-full">
                    <div
                      className={`h-2 bg-fuchsia-400 rounded-full`}
                      style={{
                        width: `${Math.round(
                          (countTrue(onboarding) /
                            Object.keys(onboarding).length) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                <Button
                  onClick={() => {
                    axios
                      .post(api("/users/signout"), null, {
                        withCredentials: true,
                      })
                      .then(() => router.push("/home"))
                      .catch(() => toast.error("error"));
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Log out
                </Button>
              </div>
            </div>
          </aside>

          <div className="w-full overflow-auto px-8 py-10">{children}</div>
          <div className="opacity-10">
            <div
              style={{
                background: getGradient(Math.random().toString()),
                animationDuration: "5000ms",
              }}
              className="w-3/4 h-1/3 absolute top-0 blur-3xl right-0 -z-10 rounded-full overflow-none rounded-br-none animate-pulse"
            />
          </div>
        </div>
      </>
    </UserContext.Provider>
  );
}

function FakeCheckbox(props: { checked: boolean }) {
  return (
    <>
      {props.checked ? (
        <div className="w-4 h-4 relative rounded-sm bg-fuchsia-400">
          <Check className="w-3 h-3 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2" />
        </div>
      ) : (
        <div className="w-4 h-4 relative rounded-sm bg-background"></div>
      )}
    </>
  );
}
