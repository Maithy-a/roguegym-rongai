"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
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

interface DataTableProps<TData> {
    columns: ColumnDef<TData, any>[]
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

export function DataTable<TData>({
    columns,
    data,
    page,
    limit,
    total,
    onRowClick,
}: DataTableProps<TData>) {

    const router = useRouter()
    const searchParams = useSearchParams()

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const totalPages = Math.ceil(total / limit)

    const updateQuery = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (!value || value === "all") {
            params.delete(key)
        } else {
            params.set(key, value)
        }

        params.set("page", "1")
        router.push(`?${params.toString()}`)
    }

    const goToPage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", String(newPage))
        router.push(`?${params.toString()}`)
    }

    const [searchValue, setSearchValue] = useState(searchParams.get("search") ?? "")
    const [plans, setPlans] = useState<Plan[]>([])

    async function getPlans() {
        try {
            const response = await fetch("/api/plans",
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

    useEffect(() => {
        setSearchValue(searchParams.get("search") ?? "")
    }, [searchParams])

    useEffect(() => {
        const timeout = setTimeout(() => {
            updateQuery("search", searchValue)
        }, 400)

        return () => clearTimeout(timeout)
    }, [searchValue])

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
                                <SelectItem key={plan.planKey} value={plan.planKey} >
                                    {plan.planTitle}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="p-1.5 bg-accent rounded-3xl shadow-sm border">
                <div className="rounded-2xl p-3 mt-4 overflow-hidden bg-white">
                    <Table className="overflow-hidden">
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
                    </Table>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                </p>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => goToPage(page - 1)}
                    >
                        Previous
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => goToPage(page + 1)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div >
    )
}