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

import {
    InputGroup,
    InputGroupInput,
    InputGroupAddon
} from "@/components/ui/input-group"

import { Search } from "lucide-react"
import TableContainer from "@/components/TableContainer"
import TableNavButtons from "@/components/TableNavButtons"
import { useTableQuery } from "@/hooks/useTableQuery"
import { useTableSearch } from "@/hooks/useTableSearch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DataTableProps<TData> {
    columns: ColumnDef<TData, any>[]
    data: TData[]

    page: number
    limit: number
    total: number

    plans?: {
        planKey: string
        title: string
    }[]

    onRowClick?: (row: TData) => void
}

export function PaymentDataTable<TData>({
    columns,
    data,

    page,
    limit,
    total,
    onRowClick,
}: DataTableProps<TData>) {

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
    } = useTableSearch({ searchParams, updateQuery })

    return (
        <div className="space-y-4">
            <div className="flex gap-3 items-center px-2">
                <InputGroup className="w-65 bg-white">
                    <InputGroupInput
                        placeholder="Search..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>
                <div>
                    <Select
                        value={searchParams.get("status") ?? "all"}
                        onValueChange={(value) =>
                            updateQuery("status", value)
                        }
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                All Statuses
                            </SelectItem>
                            <SelectItem value="success">
                                Successful
                            </SelectItem>
                            <SelectItem value="failed">
                                Failed
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

            </div>

            <TableContainer>
                <TableHeader>
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
                                className="cursor-pointer hover:bg-muted/50 transition duration-150 "
                                onClick={() => onRowClick?.(row.original)}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="py-4">
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
                                    No payments recorded yet
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
        </div>
    )
}