"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { formatToLongDate } from "@/lib/formatters"
import { Badge } from "@/components/ui/badge"
import { Employees } from "@/types/employee"
import { STAFF_ROLES } from "@/constants"

export const columns: ColumnDef<Employees>[] = [
    {
        accessorKey: "fullName",
        header: "Employee name",
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
                                "font-medium",
                                gender === "male"
                                    ? "bg-blue-100 text-blue-400"
                                    : "bg-pink-100 text-pink-400"
                            )}
                        >
                            {initials || "N/A"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                        <span className="font-medium capitalize">{name}</span>
                        <span className="text-xs text-gray-500">
                            {row.original.employeeId || "N/A"}
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
            <div className="flex flex-col normal-case">
                <span>{row.original.email}</span>
                <span className="text-xs text-gray-500">
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
                        ? "text-blue-500 bg-blue-100"
                        : gender === "female"
                            ? "text-pink-500 bg-pink-100"
                            : "text-gray-500 bg-gray-100"
                )}>
                    {gender}
                </Badge >
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
                    role === STAFF_ROLES.TRAINER
                        ? "bg-green-100 text-green-600"
                        : role === STAFF_ROLES.RECEPTIONIST
                            ? "bg-blue-100 text-blue-600"
                            : role === STAFF_ROLES.MANAGER
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
        header: "Date joined",
        cell: ({ row }) => {
            return (
                <span>
                    {formatToLongDate(row.original.createdAt)}
                </span>
            )
        }
    }
]