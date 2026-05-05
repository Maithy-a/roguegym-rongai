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

const user = {
    name: "Shaban Haider",
    email: "shaban@efferd.com",
    avatar: "/images/avatar.png",
};

export function NavUser() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="size-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="flex bg-secondary items-center justify-start gap-2">
                    <DropdownMenuLabel className="flex items-center gap-3">
                        <Avatar className="size-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <span className="font-medium text-foreground">{user.name}</span>{" "}
                            <br />
                            <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground text-xs">
                                {user.email}
                            </div>
                        </div>
                    </DropdownMenuLabel>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className="p-2">
                        <IconUser />
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-2">
                        <IconSettings />
                        Settings
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem className="w-full py-2 cursor-pointer" variant="destructive" >
                        <IconChevronLeft />
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
