"use client"

import { useRouter, useSearchParams } from "next/navigation"

interface UseTableQueryProps {
    total: number
    limit: number
}

export function useTableQuery({
    total,
    limit,
}: UseTableQueryProps) {

    const router = useRouter()
    const searchParams = useSearchParams()
    const totalPages = Math.ceil(total / limit)

    const updateQuery = (key: string, value: string) => {

        const params = new URLSearchParams(searchParams.toString())

        if (!value || value === "all") {
            params.delete(key)
        } else {
            params.set(key, value)
        }

        // Reset pagination
        params.set("page", "1")
        router.push(`?${params.toString()}`)
    }

    const goToPage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", String(newPage))
        router.push(`?${params.toString()}`)
    }

    return {
        totalPages,
        updateQuery,
        goToPage,
        searchParams,
    }
}