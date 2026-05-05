"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatToLongDate } from "@/lib/formatters"
import { cn } from "@/lib/utils"

export type Member = {
    memberId: string
    fullName: string
    email: string
    phoneNumber: string
    totalAmount: number
    status: "active" | "inactive"
    plan: string
    createdAt: string
}

export const columns: ColumnDef<Member>[] = [
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
                        <AvatarFallback
                            className={cn(
                                status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"

                            )}
                        >
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
        accessorKey: "totalAmount",
        header: "Amount",
        cell: ({ row }) => (
            <span className="font-medium">
                {formatCurrency(row.original.totalAmount)}
            </span>
        )
    },

    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status
            return (
                <Badge className={cn("capitalize",
                    status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-rose-100 text-rose-600"
                )}>
                    {status}
                </Badge>
            )
        }
    },
    {
        accessorKey: "createdAt",
        header: "Member Since",
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt)

            return (
                <span className="text-sm">
                    {formatToLongDate(date)}
                </span>
            )
        }
    }
]