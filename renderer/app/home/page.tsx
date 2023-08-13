import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/logo.svg";

function Home() {
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
          <Button>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
          <Link href="/next">Next</Link>
        </div>
      </div>
    </>
  );
}

export default Home;
