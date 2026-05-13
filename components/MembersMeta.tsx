"use client";

import { statusStyles } from "@/constants";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
    IconCircleCheck,
    IconCopy,
    IconHash,
    IconMail,
    IconPhone
} from "@tabler/icons-react";
import { useState } from "react";
import { MemberStatus } from "@/types/member";

interface MembersMetaProps {
    email: string;
    phoneNumber: string;
    memberId: string;
    status: MemberStatus;
}

export default function MembersMeta({ email, phoneNumber, memberId, status }: MembersMetaProps) {
    const [copiedValue, setCopiedValue] = useState<string | null>(null);

    const copyToClipboard = async (value: string) => {
        try {
            await navigator.clipboard.writeText(value);

            setCopiedValue(value);

            setTimeout(() => {
                setCopiedValue(null);
            }, 3000);
        } catch (error) {
            console.error("Failed to copy:", error);
        }
    }


    return (
        <div className="relative overflow-hidden bg-white rounded-lg border p-6 flex flex-col justify-between shadow-xs">
            <div
                className={cn(
                    "absolute -top-10 -left-10 h-35 w-35 rounded-full blur-3xl opacity-20",
                    statusStyles[status]
                )}
            />
            <div className="space-y-5">
                <h2 className="text-xl font-semibold">
                    Contact Details
                </h2>

                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <Button size="icon" variant="outline">
                            <IconHash />
                        </Button>

                        <div>
                            <p className="text-xs text-muted-foreground">Member ID</p>
                            <p className="text-sm font-medium truncate">
                                {memberId}
                            </p>
                        </div>
                    </div>

                    <Button
                        size="icon-sm"
                        variant="ghost"
                        className=" pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
                        onClick={() => copyToClipboard(memberId)}
                    >
                        {copiedValue === memberId ? (
                            <div className="text-green-500 bg-green-100 p-1 rounded">
                                <IconCircleCheck stroke={2} />
                            </div>
                        ) : (
                            <IconCopy stroke={2} />
                        )}
                    </Button>
                </div>

                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <Button size="icon" variant="outline">
                            <IconMail stroke={2} />
                        </Button>

                        <div>
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="text-sm font-medium break-all">{email}</p>
                        </div>
                    </div>

                    <Button
                        size="icon-sm"
                        variant="ghost"
                        className=" pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
                        onClick={() => copyToClipboard(email)}
                    >
                        {copiedValue === email ? (
                            <div className="text-green-500 bg-green-100 p-1 rounded">
                                <IconCircleCheck stroke={2} />
                            </div>
                        ) : (
                            <IconCopy stroke={2} />
                        )}
                    </Button>
                </div>

                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <Button size="icon" variant="outline">
                            <IconPhone stroke={2} />
                        </Button>

                        <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            <p className="text-sm font-medium">{phoneNumber}</p>
                        </div>
                    </div>

                    <Button
                        size="icon-sm"
                        variant="ghost"
                        className=" pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity"
                        onClick={() => copyToClipboard(phoneNumber)}
                    >
                        {copiedValue === phoneNumber ? (
                            <div className="text-green-500 bg-green-100 p-1 rounded">
                                <IconCircleCheck stroke={2} />
                            </div>
                        ) : (
                            <IconCopy stroke={2} />
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}