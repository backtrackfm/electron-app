"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import logo from "@/public/images/logo.svg";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { error, isLoading, reply } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (reply?.data) {
      router.push("/app/dashboard");
    }
  }, [reply]);

  if (error) {
    return error;
  }

  if (isLoading) {
    return <Loader className="animate-spin" />;
  }

  return (
    <>
      <div className="h-full w-full mt-8 flex justify-center">
        <div className="inline-flex flex-col gap-16">
          <div className="flex w-full justify-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 relative">
                <Image src={logo} alt="⏮️" />
              </div>
              <h1 className="text-2xl font-semibold">Backtrack</h1>
            </div>
          </div>

          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Version your music
          </h1>
          {reply?.data ? (
            <Link href="/app/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <Link href="/auth/signin">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
