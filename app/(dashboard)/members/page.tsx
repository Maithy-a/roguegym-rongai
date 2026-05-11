import MembersClient from "./MembersClient";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    plan?: string
  }
}) {

  const params = await searchParams

  const page = params.page ?? "1"
  const limit = params.limit ?? "10"
  const search = params.search ?? ""
  const status = params.status ?? "all"
  const plan = params.plan ?? "all"

  const query = new URLSearchParams({
    page: page ?? "1",
    limit: limit ?? "10",
    search: search ?? "",
    status: status ?? "all",
    plan: plan ?? "all",
  })

  const res = await fetch( 
    `${process.env.NEXT_BASE_URL}/api/members?${query.toString()}`,
    { cache: "no-store" }
  )

  const data = await res.json()

  return <MembersClient data={data} />

}
