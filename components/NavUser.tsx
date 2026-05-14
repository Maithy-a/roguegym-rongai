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

interface NavUserProps {
    employee:{
        firstName: string;
        lastName: string;
        email: string;
        imageUrl?: string;
    }
}

export async function NavUser(
    { employee }: NavUserProps
) {

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="size-8 rounded-full"
                    variant="ghost"
                >
                    <Avatar className="size-8">
                        <AvatarImage src={employee.imageUrl} />
                        <AvatarFallback>
                            {employee.firstName.charAt(0)}
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
                                <AvatarImage src={employee.imageUrl} />
                                <AvatarFallback>
                                    {employee.firstName.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                        </Button>

                        <div className="flex flex-col gap-0.5">
                            <p className="font-medium text-foreground">
                                {employee.firstName} {employee.lastName}
                            </p>
                            <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground text-xs">
                                {employee.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuItem>

                <DropdownMenuGroup className="mt-1">
                    <SignOutButton redirectUrl="/sign-in">
                        <DropdownMenuItem variant="destructive">
                                <IconChevronLeft stroke={2} size={18} />
                                Log out
                        </DropdownMenuItem>
                    </SignOutButton>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}