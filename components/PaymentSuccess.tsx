"use client"

import { CheckCircle2 } from "lucide-react"

import { Button } from "./ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "./ui/table"

import {
    formatCurrency,
    formatToShortDate,
} from "@/lib/formatters"

interface PaymentSuccessProps {
    title: string
    message: string
    onContinue: () => void

    reference: string
    paymentChannel: string
    paidAt: string
    amount: number
}

export default function PaymentSuccess({
    title,
    message,
    onContinue,
    reference,
    paymentChannel,
    paidAt,
    amount,
}: PaymentSuccessProps) {

    const verificationData = [
        { label: "Reference ID", value: reference, },
        { label: "Payment Method", value: paymentChannel },
        { label: "Payment Date", value: formatToShortDate(paidAt) },
        { label: "Amount Paid", value: formatCurrency(amount) },
    ]

    return (
        <div className="bg-accent p-0.5 rounded-2xl">
            <div className="w-full min-w-sm max-w-sm rounded-2xl bg-background p-6 shadow-xs">

                <div className="flex flex-col items-center text-center">

                    <div className="p-0.5 bg-accent h-21 w-21 rounded-full">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 border border-green-500">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                    </div>

                    <h1 className="text-xl font-bold tracking-tight text-gray-900">
                        {title}
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground max-w-sm">
                        {message}
                    </p>

                    <div className="mt-6 w-full rounded-xl border bg-muted/30 overflow-hidden">
                        <Table>
                            <TableBody>
                                {verificationData.map((item) => (
                                    <TableRow key={item.label}>
                                        <TableCell className="font-medium text-muted-foreground w-1/2 text-left">
                                            {item.label}
                                        </TableCell>

                                        <TableCell className="text-right font-mono text-sm break-all">
                                            {item.value}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <Button
                        onClick={onContinue}
                        className="mt-6 w-full h-10 rounded-xl"
                    >
                        Go to payments
                    </Button>

                </div>
            </div>
        </div>
    )
}