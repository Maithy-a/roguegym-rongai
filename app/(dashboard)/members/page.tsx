import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { IconCloudUp, IconPlus } from "@tabler/icons-react"
import Link from "next/link"
import { DataTable } from "./data-table"
import { columns } from "./columns"

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; search?: string; status?: string; plan?: string }>
}) {

  const params = await searchParams

  const page = params.page ?? "1"
  const limit = params.limit ?? "10"
  const search = params.search ?? ""
  const status = params.status ?? "all"
  const plan = params.plan ?? "all"

  const res = await fetch(
    `${process.env.NEXT_BASE_URL}/api/members?page=${page}&limit=${limit}&search=${search}&status=${status}&plan=${plan}`,
    { cache: "no-store" }
  )

  const json = await res.json()

  return (
    <main className="main-container">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Members</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your gym members, view profiles and track memberships
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="default">
            <Link href="/members/new" className="flex items-center">
              <IconPlus size={18} />
              Add New
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/members/export" className="flex items-center gap-2">
              <IconCloudUp size={18} />
              Export
            </Link>
          </Button>
        </div>
      </div>

      <Separator className="mb-6" />

      <DataTable
        columns={columns}
        data={json.members}
        page={json.page}
        limit={json.limit}
        total={json.totalMembers}
      />
    </main>
  )
}