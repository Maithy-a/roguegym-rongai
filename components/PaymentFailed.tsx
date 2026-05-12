"use client"

import { AlertTriangle } from "lucide-react"
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
    <div className="bg-accent p-0.5 rounded-lg">
      <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-xs">
        <div className="flex flex-col items-center text-center">

          <div className="p-0.5 bg-accent h-21 w-21 rounded-full">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 border-red-500">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tighter">
            {title}
          </h1>

          <p className="text-sm leading-6 text-muted-foreground">
            {message}
          </p>

          <div className="mt-8 w-full bg-muted/30 rounded-lg border p-4 text-left">
            <p className="text-sm font-semibold">
              Payment Incomplete
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              The transaction could not be verified. The member
              account remains inactive until payment is completed.
            </p>
          </div>

          <Button
            onClick={onTryAgain}
            className="mt-8 w-full bg-rose-500 text-white hover:bg-rose-600"
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}