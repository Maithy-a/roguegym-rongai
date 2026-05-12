"use client"

import { cn } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatToLongDate } from "@/lib/formatters"
import { MembersResponse } from "@/types/member"
import { avatarStyles, badgeStyles } from "@/constants"

export const columns: ColumnDef<MembersResponse>[] = [
    {
        accessorKey: "fullName",
        header: "Member",
        cell: ({ row }) => {
            const name = row.original.fullName ?? "Unknown Member"

            const initials = name
                .split(" ")
                .filter(Boolean)
                .map((name) => name[0])
                .join("")
                .toUpperCase()

            const status = row.original.status

            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className={cn(avatarStyles[status])} >
                            {initials || "N/A"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                        <span className="font-medium">{name}</span>
                        <span className="text-xs text-gray-500">
                            {row.original.email}
                        </span>
                    </div>
                </div>
            )
        }
    },

    {
        accessorKey: "plan",
        header: "Current Plan",
    },

    {
        accessorKey: "phoneNumber",
        header: "Phone",
    },

    {
        accessorKey: "amountPaid",
        header: "Amount paid",
        cell: ({ row }) => (
            <span className="font-medium">
                {formatCurrency(row.original.amountPaid)}
            </span>
        )
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status
            return (
                <Badge className={cn("capitalize", badgeStyles[status])}>
                    {status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "createdAt",
        header: "Member Since",
        cell: ({ row }) => {
            return (
                <span className="text-sm">
                    {formatToLongDate(row.original.createdAt)}
                </span>
            )
        }
    }
]