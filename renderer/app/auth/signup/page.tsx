"use client";

import { SignupForm } from "@/components/forms/signup-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/public/images/logo.svg";
import brandImg from "@/public/images/scott-rodgerson-z0MDyylvY1k-unsplash.jpg";
import Image from "next/image";
import Link from "next/link";

export default function SignUp() {
  return (
    <>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/auth/signin"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Sign in
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900 overflow-hidden">
            <Image
              src={brandImg}
              width={1280}
              height={843}
              alt="Authentication"
              className="block object-cover"
            />
          </div>
          <div className="relative z-20 flex items-center text-lg font-medium gap-2">
            <Image src={logo} alt="⏮️" className="w-10 h-10" />
            Backtrack
          </div>
        </div>
        <div className="flex lg:hidden absolute top-10 left-10">
          <div className="relative z-20 flex items-center text-lg font-medium gap-2">
            <Image src={logo} alt="⏮️" className="w-10 h-10" />
            Backtrack
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                We know you just want to make music.
              </p>
            </div>
            <SignupForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
