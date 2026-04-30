"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
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
import { useState } from "react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput
} from "@/components/ui/input-group"

import { Search, ListFilterPlus } from "lucide-react"
import { CreatePlanDialog } from "@/components/CreatePlanDialog"
import Image from "next/image"

import { useRouter } from "next/navigation"

interface BillingDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function BillingDataTable<TData, TValue>({
    columns,
    data,
}: BillingDataTableProps<TData, TValue>) {

    const router = useRouter()

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        state: {
            columnFilters,
        },

        getCoreRowModel: getCoreRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),

    })

    const filteredRowCount = table.getFilteredRowModel().rows.length

    return (
        <>
            <div className="flex items-center gap-2 ">
                <InputGroup className="max-w-xs">
                    <InputGroupInput placeholder="Search plans..."
                        value={(table.getColumn("planTitle")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("planTitle")?.setFilterValue(event.target.value)
                        }
                    />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                        {filteredRowCount} {" "}
                        {filteredRowCount === 1 ? "result" : "results"}
                    </InputGroupAddon>
                </InputGroup>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <ListFilterPlus className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => table.getColumn("status")?.setFilterValue(undefined)}
                        >
                            All
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => table.getColumn("status")?.setFilterValue("active")}
                        >
                            Active
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => table.getColumn("status")?.setFilterValue("inactive")}
                        >
                            Inactive
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-2xl border p-3 mt-4 overflow-hidden">
                <Table className="overflow-hidden">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className="text-xs uppercase font-bold cursor-pointer"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
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
                                    className="cursor-pointer hover:bg-muted transition"
                                    onClick={() => router.push(`/membership-plans/${(row.original as any).id}`)}
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
                                <TableCell
                                    colSpan={columns.length}
                                >
                                    <div className="flex flex-col items-center justify-center gap-2 py-10">
                                        <Image
                                            src='/images/empty-table.svg'
                                            width='150'
                                            height='150'
                                            alt=""
                                            className="border rounded-full"
                                        />
                                        <p className="text-sm text-gray-500">
                                            No plans Available at the moment.
                                        </p>
                                        <CreatePlanDialog />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </>

    )
}