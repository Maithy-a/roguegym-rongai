"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconPlus, IconCloudUp } from "@tabler/icons-react"
import { DataTable } from "./data-table"
import { columns } from "./columns"
import AddEmployee from "@/components/employees/AddEmployee"
import { useRouter } from "next/navigation"

export default function EmployeesClient({ data }: any) {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    return (
        <section className="main-container">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Employees</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your gym employees, view profiles and track roles
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button onClick={() => setOpen(true)}>
                        <IconPlus size={18} />
                        Add Employee
                    </Button>

                    <Button asChild variant="outline">
                        <Link href="/employees/export" className="flex items-center gap-2">
                            <IconCloudUp size={18} />
                            Export
                        </Link>
                    </Button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={data.employees}
                page={data.page}
                limit={data.limit}
                total={data.totalEmployees}
                onRowClick={(employee) => { router.push(`/employees/${employee.employeeId}`) }}
            />

            <AddEmployee
                open={open}
                onOpenChange={setOpen}
            />

        </section>
    )
}