"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";

interface Member {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface MembersListProps {
    members: Member[];
    emptylabel: string;
    emptyTitle: string;
}

export default function MembersList({
    members,
    emptylabel,
    emptyTitle,
}: MembersListProps) {
    const router = useRouter();

    return members.length ? (
        <div className="bg-accent rounded-lg p-0.5">
            <div className="flex items-center justify-between px-2 py-1">
                <h3 className="text-lg font-semibold">Members enrolled</h3>
            </div>

            <div className="bg-white rounded-lg border overflow-hidden">
                <Table className="w-full text-sm">
                    <TableBody>
                        {members.map((member) => {
                            const initials = `${member.firstName?.[0] ?? ""}${member.lastName?.[0] ?? ""
                                }`.toUpperCase();

                            return (
                                <TableRow
                                    key={member.id}
                                    onClick={() =>
                                        router.push(`/members/${member.id}`)
                                    }
                                    className="group cursor-pointer border-t transition-all first:border-t-0 hover:bg-accent/50"
                                >
                                    <TableCell className="flex items-center gap-2">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback className="border text-xs font-medium">
                                                {initials || "NA"}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex flex-col leading-tight">
                                            <span className="text-sm font-medium">
                                                {member.firstName} {member.lastName}
                                            </span>

                                            <span className="text-xs text-gray-500">
                                                {member.email}
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    ) : (
        <div className="rounded-xl border bg-white p-6 flex flex-col items-center text-center gap-4">
            <Image
                src="/images/empty-illustration.png"
                alt="empty illustration"
                width={110}
                height={110}
                className="opacity-80"
            />

            <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">
                    {emptyTitle}
                </p>

                <p className="text-xs text-muted-foreground max-w-56">
                    {emptylabel}
                </p>
            </div>
        </div>
    );
}