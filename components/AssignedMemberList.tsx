"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconUserPlus } from "@tabler/icons-react";
import Image from "next/image";

interface Member {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    role: string;
}

interface AssignedMembersListProps {
    members: Member[];
    role: string;
}

export default function AssignedMembersList({ members, role }: AssignedMembersListProps) {
    const router = useRouter();

    if (!members?.length) {
        return (
            <div className="rounded-xl border bg-white p-6 flex flex-col items-center text-center gap-4">
                <Image
                    src="/images/empty-illustration.png"
                    alt="No members assigned"
                    width={110}
                    height={110}
                    className="opacity-80"
                />

                <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">No Members Assigned</p>
                    <p className="text-xs text-muted-foreground max-w-56">
                        Members assigned to this trainer will appear here.
                    </p>
                </div>

                <Button
                    variant="outline"
                    className="text-xs px-3 py-1.5 h-8"
                    disabled={role !== "trainer"}
                >
                    <IconUserPlus
                        size={14}
                        className="mr-1"
                    />
                    Assign Member
                </Button>
            </div>
        )
    }

    return (
        <div className="max-h-125 overflow-y-auto">
            <div className="rounded-xl border bg-background p-2">
                <ul className="divide-y divide-gray-100">
                    {members.map((member) => {
                        const initials = `${member.firstName?.[0] ?? ""}${member.lastName?.[0] ?? ""}`.toUpperCase();

                        return (
                            <li
                                key={member.id}
                                onClick={() => router.push(`/members/${member.id}`)}
                                className="flex items-center py-3 hover:bg-gray-50 transition-colors px-2 cursor-pointer"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback className="border text-xs font-medium">
                                            {initials || "NA"}
                                        </AvatarFallback>
                                    </Avatar>
                                    
                                    <div className="flex flex-col leading-tight">
                                        <span className="text-sm font-medium text-gray-900">
                                            {member.firstName} {member.lastName}
                                        </span>
                                        {member.email && (
                                            <span className="text-xs text-gray-500">
                                                {member.email}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}