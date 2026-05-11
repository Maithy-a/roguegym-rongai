import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconUser, IconSettings, IconChevronLeft } from "@tabler/icons-react";
import { Button } from "./ui/button";

const user = {
    name: "Shaban Haider",
    email: "shaban@efferd.com",
    avatar: "/images/avatar.png",
    role: "Administrator"
};

export function NavUser() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="size-8 rounded-full" variant="ghost">
                    <Avatar className="size-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex bg-muted items-center justify-start gap-2">
                    <DropdownMenuLabel className="flex items-center gap-3">
                        <Button variant="ghost" className="size-10 rounded-full">
                            <Avatar className="size-10">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </Button>
                        <div className="flex flex-col gap-0.5">
                            <p className="font-medium text-foreground">{user.name}</p>{" "}
                            <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground text-xs">
                                {user.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuItem>

                <DropdownMenuGroup className="mt-1">
                    <DropdownMenuItem variant="destructive" >
                        <IconChevronLeft />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
