import { Building2 } from "lucide-react"
import { BillingDataTable } from "./data-table"
import { columns } from "./columns"
import { CreatePlanDialog } from "@/components/CreatePlanDialog"
import { Badge } from "@/components/ui/badge"

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

      <div className="p-0.5 bg-muted rounded-3xl">
        <div className="relative overflow-hidden rounded-2xl border bg-white p-6 py-8">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <Building2 className="text-primary" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Billing Plans
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Organize your subscriptions and pricing structure.
                  </p>
                </div>
              </div>

              <Badge>{totalPlans} {totalPlans === 1 ? "Plan" : "Plans"}</Badge>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Plans define how members subscribe and pay for services.
              </p>

              <CreatePlanDialog />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <BillingDataTable
          columns={columns}
          data={data}
        />
      </div>

    </section>
  )
}