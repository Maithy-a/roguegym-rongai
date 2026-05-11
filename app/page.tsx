import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  return (
    <main>
      <h1 className="text-3xl font-medium">Default page running</h1>
      <p>{userId ? "Signed in" : "Signed out"}</p>
      / running
      <Button asChild>
        <Link href="/members">Dashboard</Link>
      </Button>
    </main>
  );
}
