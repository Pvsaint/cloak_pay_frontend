"use client"

import { useState } from "react"
import { SenderFlow } from "@/components/sender-flow"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, ExternalLink } from "@/components/simple-icons"
import { starknetUtils } from "@/lib/starknet"

export default function SenderPage() {
  const router = useRouter()
  const [isComplete, setIsComplete] = useState(false)
  const [paymentData, setPaymentData] = useState<{
    secret: string
    commitment: string
    shareableLink: string
    txHash: string
  } | null>(null)

  const handleComplete = (data: { secret: string; commitment: string; shareableLink: string; txHash: string }) => {
    setPaymentData(data)
    setIsComplete(true)
  }

  const handleCancel = () => {
    router.push("/")
  }

  if (isComplete && paymentData) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <div className="text-center space-y-4 mb-8">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-accent">Payment Sent Successfully!</h1>
            <p className="text-muted-foreground">
              Your private payment has been processed and committed to the StarkNet blockchain.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
              <CardDescription>Transaction details and sharing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Transaction Hash</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono text-sm">{paymentData.txHash.slice(0, 10)}...</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(starknetUtils.getExplorerUrl(paymentData.txHash), "_blank")}
                      className="h-6 w-6 p-0"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Shareable Link</p>
                  <p className="font-mono text-sm">{paymentData.shareableLink}</p>
                </div>
              </div>

              <div className="p-3 bg-accent/10 rounded-lg">
                <p className="text-sm font-medium text-accent">Next Steps</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Share the secret with the recipient so they can claim the funds using their StarkNet wallet.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push("/")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <Button onClick={() => router.push("/receiver")}>View Receiver Dashboard</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="mb-8">
          <Button onClick={handleCancel} variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Send Private Payment</h1>
          <p className="text-muted-foreground mt-2">Complete your anonymous transaction using zero-knowledge proofs</p>
        </div>

        <SenderFlow
          amount="0.05"
          currency="ETH"
          merchantName="Demo Store"
          productName="Premium Widget"
          onComplete={handleComplete}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
