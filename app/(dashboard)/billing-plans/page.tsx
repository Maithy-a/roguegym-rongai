import { Building2 } from "lucide-react"
import { BillingDataTable } from "./data-table"
import { columns } from "./columns"
import { CreatePlanDialog } from "@/components/plans/CreatePlanDialog"
import { Badge } from "@/components/ui/badge"
import BillingPlanBanner from "./billing-plan-banner"

export default async function BillingPlansPage() {
  const res = await fetch(`${process.env.NEXT_BASE_URL}/api/plans`, {
    cache: "no-store",
  })

  const data = await res.json()
  const totalPlans = data.length

  return (
    <section className="main-container space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Subscription Plans
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage pricing plans for your members.
          </p>
        </div>
      </div>

      <BillingPlanBanner
        totalPlans={totalPlans}
      />

      <div className="space-y-2">
        <BillingDataTable
          columns={columns}
          data={data}
        />
      </div>

    </section>
  )
}