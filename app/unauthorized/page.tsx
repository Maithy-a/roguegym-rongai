import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";

export default function UnauthorizedPage() {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="space-y-4 text-center">
                <h1 className="text-2xl font-bold">
                    Unauthorized
                </h1>

                <p className="text-muted-foreground">
                    Your account does not have access to this dashboard.
                </p>

                <SignOutButton redirectUrl="/sign-in">
                    <Button>
                        Sign Out
                    </Button>
                </SignOutButton>
            </div>
        </div>
    );
}