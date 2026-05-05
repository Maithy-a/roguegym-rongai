import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "./ui/button"
import { formatCurrency, formatToLongDate } from "@/lib/formatters"
import { SquarePen } from "lucide-react"
import { useState } from "react"

interface ViewPlanSheetProps {
    id: string
    name: string
    description: string
    price: number
    duration: number
    created: Date
    updated: Date
    onOpenChange?: (open: boolean) => void
}

export function ViewPlanSheet({
    id,
    name,
    description,
    price,
    duration,
    created,
    updated,
    onOpenChange,
}: ViewPlanSheetProps) {

    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>View & Edit {name} Plan</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </SheetDescription>
                    <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-4 right-4 rounded-full">
                        <SquarePen className="h-4 w-4" />
                    </Button>
                </SheetHeader>
                <div className="grid flex-1 auto-rows-min gap-6 px-4">
                    <ul>
                        <li><strong>ID:</strong> {id}</li>
                        <li><strong>Name:</strong> {name}</li>
                        <li><strong>Description:</strong> {description}</li>
                        <li><strong>Price:</strong> {formatCurrency(price)}</li>
                        <li><strong>Duration:</strong> {duration} days</li>
                        <li><strong>Created At:</strong> {formatToLongDate(created)}</li>
                        <li><strong>Updated At:</strong> {formatToLongDate(updated)}</li>
                    </ul>
                </div>
                <SheetFooter>
                    <Button type="submit">Save changes</Button>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>

    )
}
