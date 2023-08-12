import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

function Home() {
  return (
    <div className="h-screen min-h-screen">
      <div className="bg-zinc-950 h-full">
        <div>
          <div className="w-64 h-64 relative">
            <Image src="/images/logo.svg" alt="⏮️" layout="fill" />
          </div>
          <h1 className="text-white">Hello World</h1>
          <Button>hello</Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
