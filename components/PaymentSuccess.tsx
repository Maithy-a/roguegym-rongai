"use client"

import { CheckCircle2 } from "lucide-react"
import { Button } from "./ui/button"

interface PaymentSuccessProps {
    title: string
    message: string
    onContinue: () => void
}

export default function PaymentSuccess({
    title,
    message,
    onContinue,
}: PaymentSuccessProps) {
    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4">
            <div className="w-full max-w-lg rounded-2xl border bg-white p-8">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                        <CheckCircle2 className="h-10 w-10 text-green-600" />
                    </div>

                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        {title}
                    </h1>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground max-w-sm">
                        {message}
                    </p>

                    <div className="mt-8 w-full rounded-2xl border bg-muted/30 p-4 text-left">
                        <p className="text-sm font-medium text-gray-900">
                            Membership Activated
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                            The member payment has been verified successfully and
                            their gym membership is now active.
                        </p>
                    </div>

                    <Button
                        onClick={onContinue}
                        className="mt-8 w-full h-11 rounded-xl"
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </div>
    )
}