import { Button } from "@/components/ui/button";
import Link from "next/link";

function Home() {
  return (
    <>
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ -
          <Link href="/next">Go to next page hello</Link>
        </p>
        <img src="/images/logo.png" />
        <h1 className="text-red-500">hello</h1>
        <Button>Hello</Button>
      </div>
    </>
  );
}

export default Home;
