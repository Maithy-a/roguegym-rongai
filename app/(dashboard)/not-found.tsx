import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function NotFound() {
    return (
        <div className="flex h-screen flex-col items-center justify-center">
            <Link href="/">
                <Image
                    src="/icons/favicon.svg"
                    width={63}
                    height={63}
                    alt="Rogue gym logo"
                />
            </Link>
            <p className="mt-6 text-3xl font-medium text-muted-foreground">
                404
            </p>
            <h1 className="mt-4 text-2xl font-semibold">
                Page not found
            </h1>
            <p className="mt-2 text-sm text-gray-600">
                Sorry, we couldn't find the page you're looking for.
            </p>
            <Button asChild className="group mt-4" variant="outline">
                <Link href="/">Go to the home page</Link>
            </Button>
        </div>
    )
}
