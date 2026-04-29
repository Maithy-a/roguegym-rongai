import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import RevenueChart from "@/components/RevenueChart"
import ChartBarMultiple from "@/components/ChartBarMultiple"
import KpiCard from "@/components/KpiCard"
import { kpiMetrics } from "@/constants"

export default async function Dashboard() {
  const user = await currentUser()

  if (!user) {
    redirect("/sign-in")
  }

  return (
    <main className="main-container">
      <h2 className="text-3xl font-medium">
        Welcome back, {user.firstName || user.username || "User not found!"}
      </h2>
      <p className="text-base text-muted-foreground">
        Hope you're having a great day!
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpiMetrics.map((kpi) => (
          <KpiCard
            key={kpi.title}
            {...kpi}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 pt-4">
        <RevenueChart />
        <ChartBarMultiple />
      </div>
    </main>
  )
}
