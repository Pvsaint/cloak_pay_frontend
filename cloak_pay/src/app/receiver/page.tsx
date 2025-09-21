"use client"

import { ReceiverDashboard } from "@/components/receiver-dashboard"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "@/components/simple-icons"
import { useRouter } from "next/navigation"

export default function ReceiverPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto pt-8">
        <div className="mb-8">
          <Button onClick={() => router.push("/")} variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <ReceiverDashboard />
      </div>
    </div>
  )
}
