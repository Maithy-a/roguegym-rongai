"use client"

import { AlertTriangle, RefreshCcw } from "lucide-react"
import { Button } from "./ui/button"

interface PaymentFailedProps {
  title: string
  message: string
  onTryAgain: () => void
}

export default function PaymentFailed({
  title,
  message,
  onTryAgain,
}: PaymentFailedProps) {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>

          <p className="mt-3 text-sm leading-6 text-muted-foreground max-w-sm">
            {message}
          </p>

          <div className="mt-8 w-full rounded-2xl border bg-muted/30 p-4 text-left">
            <p className="text-sm font-medium text-gray-900">
              Payment Incomplete
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              The transaction could not be verified. The member
              account remains inactive until payment is completed.
            </p>
          </div>

          <Button
            onClick={onTryAgain}
            variant="destructive"
            className="mt-8 w-full h-11 rounded-xl"
          >
            Try Again
            <RefreshCcw className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}