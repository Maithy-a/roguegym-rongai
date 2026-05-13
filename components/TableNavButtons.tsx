import { Button } from "./ui/button";

interface TableNavButtonsProps {
    page: number;
    totalPages: number;
    goToPage: (page: number) => void;
}

export default function TableNavButtons({
    page,
    totalPages,
    goToPage
}: TableNavButtonsProps) {
    return (
        <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                >
                    Previous
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => goToPage(page + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
