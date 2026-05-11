"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/formatters"
import { BillingPlan, PlanStatus } from "@/types/billing-plan"
import { statusBadgeStyles } from "@/constants"

export const columns: ColumnDef<BillingPlan>[] = [
    {
        accessorKey: "planTitle",
        header: "Plan Title",
        cell: ({ row }) => {
            const name = row.getValue("planTitle") as string
            const duration = row.original.duration

            return (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900 capitalize">
                        {name}
                    </span>
                    <span className="text-xs text-gray-500">
                        Billed every {duration} {duration === 1 ? "month" : "months"}
                    </span>
                </div>
            )
        }
    },

    {
        accessorKey: "duration",
        header: "Billing Cycle",
        cell: ({ row }) => {
            const duration = row.getValue("duration") as number
            return (
                <span className="text-gray-700 font-medium capitalize">
                    {duration} {duration === 1 ? "month" : "months"}
                </span>
            )
        }
    },

    {
        accessorKey: "price",
        header: "Plan Cost",
        cell: ({ row }) => {
            const price = row.getValue("price") as number
            return (
                <div className="font-medium text-gray-900">
                    {formatCurrency(price)}
                </div>
            )
        }
    },

    {
        accessorKey: "status",
        header: "Status",
        filterFn: "equalsString",
        cell: ({ row }) => {
            const status = row.getValue("status") as string

            return (
                <Badge className={cn("capitalize",
                    statusBadgeStyles[status as PlanStatus]
                )}>
                    {status}
                </Badge>
            )
        }
    },
]