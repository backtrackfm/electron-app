import Head from "next/head";
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
      </div>
    </>
  );
}

export default Home;
