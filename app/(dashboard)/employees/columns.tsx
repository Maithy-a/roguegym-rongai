"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { formatToLongDate } from "@/lib/formatters"
import { Badge } from "@/components/ui/badge"

export type Employees = {
    employeeId: string
    fullName: string
    phoneNumber: string
    email: string
    gender: string
    role: "trainer" | "receptionist" | "manager" | "admin"
    createdAt: Date
}

export const columns: ColumnDef<Employees>[] = [
    {
        accessorKey: "fullName",
        header: "Full Name",
        cell: ({ row }) => {
            const name = row.original.fullName ?? "Unknown Member"

            const initials = name
                .split(" ")
                .filter(Boolean)
                .map((name) => name[0])
                .join("")
                .toUpperCase()

            const gender = row.original.gender

            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback
                            className={cn(
                                gender === "male"
                                    ? "bg-blue-100 text-blue-400"
                                    : "bg-pink-100 text-pink-400"
                            )}
                        >
                            {initials || "N/A"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                        <span className="font-medium">{name}</span>
                        <span className="text-xs text-gray-500">
                            {row.original.employeeId}
                        </span>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "email",
        header: "Contact info",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span>{row.original.email}</span>
                <span className="text-sm text-gray-500">
                    {row.original.phoneNumber}
                </span>
            </div>
        )
    },
    {
        accessorKey: "gender",
        header: "Gender",
        cell: ({ row }) => {
            const gender = row.original.gender
            return (
                <Badge className={cn("capitalize",
                    gender === "male"
                        ? "text-blue-400 bg-blue-100"
                        : "text-pink-400 bg-pink-100"
                )}>
                    {gender}
                </Badge>
            )
        }
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => {
            const role = row.original.role
            return (
                <Badge className={cn("capitalize",
                    role === "trainer"
                        ? "bg-green-100 text-green-600"
                        : role === "receptionist"
                            ? "bg-blue-100 text-blue-600"
                            : role === "manager"
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-gray-100 text-gray-600"
                )}>
                    {role}
                </Badge>
            )
        }
    },
    {
        accessorKey: "createdAt",
        header: "Date Joined",
        cell: ({ row }) => {
            const date = new Date(row.original.createdAt)
            return (
                <span>
                    {formatToLongDate(date)}
                </span>
            )
        }
    }
]