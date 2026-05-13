"use client"

import { useEffect, useState } from "react"

interface UseTableSearchProps {
    searchParams: URLSearchParams
    updateQuery: (key: string, value: string) => void
    delay?: number
}

export function useTableSearch({
    searchParams,
    updateQuery,
    delay = 500,
}: UseTableSearchProps) {

    const [searchValue, setSearchValue] = useState(
        searchParams.get("search") ?? ""
    )

    // Sync input with URL changes
    useEffect(() => {
        setSearchValue(searchParams.get("search") ?? "")
    }, [searchParams])

    // Debounced search
    useEffect(() => {

        const timeout = setTimeout(() => {
            updateQuery("search", searchValue)
        }, delay)

        return () => clearTimeout(timeout)
    }, [searchValue, delay])

    return {
        searchValue,
        setSearchValue,
    }
}