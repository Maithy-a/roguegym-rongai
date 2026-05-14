"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon
} from "@/components/ui/input-group"

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem
} from "@/components/ui/select"

import { Search } from "lucide-react"
import { MemberStatus } from "@/types/member"
import TableContainer from "@/components/TableContainer"
import TableNavButtons from "@/components/TableNavButtons"
import { useTableQuery } from "@/hooks/useTableQuery"
import { useTableSearch } from "@/hooks/useTableSearch"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]

    page: number
    limit: number
    total: number
    onRowClick?: (row: TData) => void
}
interface Plan {
    id: string
    planKey: string
    planTitle: string
    status: string
}

const memberStatuses: MemberStatus[] = [
    "pending",
    "active",
    "expired",
]

export function DataTable<TData, TValue>({
    columns,
    data,
    page,
    limit,
    total,
    onRowClick,
}: DataTableProps<TData, TValue>) {

    const searchParams = useSearchParams()

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const {
        totalPages,
        updateQuery,
        goToPage,
    } = useTableQuery({ total, limit })

    const {
        searchValue,
        setSearchValue,
    } = useTableSearch({ searchParams, updateQuery, })

    const [plans, setPlans] = useState<Plan[]>([])

    async function getPlans() {
        try {
            const response = await fetch(
                "/api/plans",
                { cache: "no-store" }
            )

            if (!response.ok) throw new Error("Failed to fetch plans")

            const data = await response.json()
            setPlans(data)
        } catch (error) {
            console.error("Error fetching plans:", error)
        }
    }

    useEffect(() => { getPlans() }, [])

    return (
        <div className="space-y-4">
            <div className="flex gap-3 items-center px-2">
                <InputGroup className="w-65 bg-white">
                    <InputGroupInput
                        placeholder={"Search..."}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>

                <div className="flex gap-3" >
                    <Select
                        value={searchParams.get("status") ?? "all"}
                        onValueChange={(value) => updateQuery("status", value)}
                    >
                        <SelectTrigger className="w-45 bg-white">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            {memberStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={searchParams.get("plan") ?? "all"}
                        onValueChange={(value) => updateQuery("plan", value)}
                    >
                        <SelectTrigger className="w-45 bg-white">
                            <SelectValue placeholder="Filter by plan" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">All Plans</SelectItem>
                            {plans.map((plan) => (
                                <SelectItem
                                    key={plan.planKey}
                                    value={plan.planKey}
                                >
                                    {plan.planTitle}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <TableContainer>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="py-3">
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    className="font-medium" >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                className="cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                                onClick={() => onRowClick?.(row.original)}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="py-3">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length}>
                                <div className="text-center py-10 text-sm text-gray-700">
                                    <Image
                                        src="/images/empty-table.svg"
                                        alt="No data"
                                        width={150}
                                        height={150}
                                        className="mx-auto mb-4 border rounded-full"
                                    />
                                    No data to show
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </TableContainer>

            <TableNavButtons
                page={page}
                totalPages={totalPages}
                goToPage={goToPage}
            />
        </div >
    )
}