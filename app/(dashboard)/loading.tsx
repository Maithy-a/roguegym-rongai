import { IconLoader } from "@tabler/icons-react";

export default function LoadingPage() {
    return (
        <section className="main-container flex items-center justify-center">
            <div className="flex flex-col items-center text-center">
                <IconLoader className="animate-spin text-muted-foreground" stroke={2} />
            </div>
        </section>
    )
}