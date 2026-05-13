"use client"

import { ColumnDef } from "@tanstack/react-table"
import { PaymentResponse } from "@/types/payments"
import { Badge } from "@/components/ui/badge"
import {
    formatCurrency,
    formatToShortDate,
} from "@/lib/formatters"
import { cn } from "@/lib/utils"

export const columns: ColumnDef<PaymentResponse>[] = [
    {
        accessorKey: "reference",
        header: "Reference",
        cell: ({ row }) => (
            <div className="font-mono text-xs font-medium text-gray-500">
                {row.original.reference}
            </div>
        ),
    },
    {
        accessorKey: "plan",
        header: "Subscription Plan",
        cell: ({ row }) => (
            <div className="font-medium">
                {row.original.plan}
            </div>
        ),
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => (
            <div className="font-medium font-muted-foreground font-mono">
                {formatCurrency(
                    Number(row.original.amount)
                )}
            </div>
        ),
    },
    {
        accessorKey: "paymentChannel",
        header: "Payment Method",
        cell: ({ row }) => (
            <Badge
                variant="secondary"
                className="capitalize"
            >
                {row.original.paymentChannel.replace("_", " ")}
            </Badge>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {

            const status = row.original.status

            return (
                <Badge
                    className={cn("capitalize",
                        status === "success"
                            ? "bg-green-100 text-green-800"
                            : status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"

                    )}
                >
                    {status}
                </Badge>
            )
        },
    },

    {
        accessorKey: "paidAt",
        header: "Created At",
        cell: ({ row }) => (
            <div className="text-sm">
                {formatToShortDate(row.original.paidAt)}
            </div>
        ),
    },
]