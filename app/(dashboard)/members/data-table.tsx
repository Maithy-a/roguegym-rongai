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

interface DataTableProps<TData> {
    columns: ColumnDef<TData, any>[]
    data: TData[]
    page: number
    limit: number
    total: number
}

export function DataTable<TData>({
    columns,
    data,
    page,
    limit,
    total,
}: DataTableProps<TData>) {

    const router = useRouter()
    const searchParams = useSearchParams()

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const totalPages = Math.ceil(total / limit)

    // ✅ helper to update URL
    const updateQuery = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (!value || value === "all") {
            params.delete(key)
        } else {
            params.set(key, value)
        }

        params.set("page", "1") // reset page on filter change

        router.push(`?${params.toString()}`)
    }

    // ✅ pagination
    const goToPage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", String(newPage))
        router.push(`?${params.toString()}`)
    }

    // ✅ search state (with debounce)
    const [searchValue, setSearchValue] = useState(
        searchParams.get("search") ?? ""
    )

    useEffect(() => {
        const timeout = setTimeout(() => {
            updateQuery("search", searchValue)
        }, 400)

        return () => clearTimeout(timeout)
    }, [searchValue])

    return (
        <div className="space-y-4">

            <div className="flex justify-between gap-3 items-center">
                <InputGroup className="w-65">
                    <InputGroupInput
                        placeholder="Search member..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>

                <div className="flex gap-2">
                    <Select
                        defaultValue={searchParams.get("status") ?? "all"}
                        onValueChange={(value) => updateQuery("status", value)}
                    >
                        <SelectTrigger className="w-45">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        defaultValue={searchParams.get("plan") ?? "all"}
                        onValueChange={(value) => updateQuery("plan", value)}
                    >
                        <SelectTrigger className="w-45">
                            <SelectValue placeholder="Filter by plan" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Plans</SelectItem>
                            <SelectItem value="Basic">Basic</SelectItem>
                            <SelectItem value="Students">Students</SelectItem>
                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                            <SelectItem value="Contractual">Contractual</SelectItem>
                        </SelectContent>
                    </Select>

                </div>
            </div>

            <div className="rounded-2xl border p-3 mt-4 overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
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
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => {
                                        const member = row.original as any
                                        router.push(`/members/${member.memberId}`)
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
        </div>
    )
}