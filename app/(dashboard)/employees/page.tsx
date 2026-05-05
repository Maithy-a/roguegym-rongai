import EmployeesClient from "./EmployeeClient"

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: {
    page?: string
    limit?: string
    search?: string
    gender?: string
    role?: string
  }
}) {

  const params = await searchParams

  const page = params.page
  const limit = params.limit
  const search = params.search
  const role = params.role

  const query = new URLSearchParams({
    page: page ?? "1",
    limit: limit ?? "10",
    search: search ?? "",
    role: role ?? "all",
  })

  const res = await fetch(
    `${process.env.NEXT_BASE_URL}/api/employees?${query.toString()}`,
    { cache: "no-store" }
  )

  const employeeData = await res.json()

  return (
    <EmployeesClient
      data={employeeData}
    />
  )
}