"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, formatToShortDate } from "@/lib/formatters"

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
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) =>
                    row.toggleSelected(!!value)
                }
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

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

            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 bg-gray-300">
                        <AvatarFallback>{initials || "?"}</AvatarFallback>
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
                <Badge
                    className={
                        status === "active"
                            ? "bg-green-100 text-green-800 capitalize"
                            : "bg-gray-100 text-gray-800 capitalize"
                    }
                >
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
                <span className="text-sm text-muted-foreground">
                    {formatToShortDate(date)}
                </span>
            )
        }
    }
]