import { LoaderIcon } from "lucide-react";

export default function LoadingPage() {
    return (
        <section className="main-container flex items-center justify-center">
            <div className="flex flex-col items-center text-center">
                <LoaderIcon className="animate-spin text-muted-foreground" />
            </div>
        </section>
    )
}