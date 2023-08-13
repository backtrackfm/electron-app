import { SigninForm } from "@/components/forms/signin-form";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import brandImg from "@/public/images/scott-rodgerson-z0MDyylvY1k-unsplash.jpg";
import logo from "@/public/images/logo.svg";

export default function SignIn() {
  return (
    <>
      <div className="container relative h-screen flex-col items-center justify-center flex md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/auth/signup"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Sign up
        </Link>
        <div className="relative h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex hidden">
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
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 xs:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Sign into your account
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back! Get back to creating
              </p>
            </div>
            <SigninForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
