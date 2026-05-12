import {
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "./ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import { SignOutButton } from "@clerk/nextjs";
import { getCurrentEmployee } from "@/lib/auth";

export async function NavUser() {

    const user = await getCurrentEmployee();
    if (!user) return null;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="size-8 rounded-full"
                    variant="ghost"
                >
                    <Avatar className="size-8">
                        <AvatarImage src={user.imageUrl} />
                        <AvatarFallback>
                            {user.firstName.charAt(0)}
                        </AvatarFallback>
                        <AvatarBadge className="bg-green-600 dark:bg-green-800" />
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex bg-muted items-center justify-start gap-2">
                    <DropdownMenuLabel className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            className="size-10 rounded-full"
                        >
                            <Avatar className="size-10">
                                <AvatarImage src={user.imageUrl} />
                                <AvatarFallback>
                                    {user.firstName.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </Button>

                        <div className="flex flex-col gap-0.5">
                            <p className="font-medium text-foreground">
                                {user.fullName}
                            </p>
                            <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground text-xs">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuItem>

                <DropdownMenuGroup className="mt-1">
                    <SignOutButton redirectUrl="/sign-in">
                        <DropdownMenuItem variant="destructive">
                            <IconChevronLeft stroke={2} />
                            Log out
                        </DropdownMenuItem>
                    </SignOutButton>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}