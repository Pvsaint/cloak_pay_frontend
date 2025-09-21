"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Send, CheckCircle, ArrowRight, ArrowLeft, Info } from "@/components/simple-icons"
import { useStarkNet } from "@/hooks/use-starknet"
import { StarkNetWalletConnector } from "@/components/starknet-wallet-connector"
import { starknetUtils } from "@/lib/starknet"

interface NormalPaymentProps {
  amount: string
  currency: string
  merchantName: string
  productName: string
  onComplete: (txHash: string) => void
  onCancel: () => void
}

export function NormalPayment({
  amount,
  currency,
  merchantName,
  productName,
  onComplete,
  onCancel,
}: NormalPaymentProps) {
  const [recipientAddress, setRecipientAddress] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [step, setStep] = useState<"connect" | "confirm" | "processing" | "complete">("connect")

  const { wallet, isTransacting } = useStarkNet()

  const handleWalletConnected = () => {
    setStep("confirm")
  }

  const handlePayment = async () => {
    if (!wallet || !recipientAddress) return

    setIsProcessing(true)
    setStep("processing")

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generate mock transaction hash
      const mockTxHash = `0x${Math.random().toString(16).slice(2).padStart(64, "0")}`
      setTxHash(mockTxHash)
      setStep("complete")

      console.log("[v0] Normal payment completed:", mockTxHash)
    } catch (error) {
      console.error("Payment failed:", error)
      setStep("confirm")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleComplete = () => {
    onComplete(txHash)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Standard Payment
          </CardTitle>
          <CardDescription>Complete your payment using a standard blockchain transaction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Product</Label>
              <p className="font-medium">{productName}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Merchant</Label>
              <p className="font-medium">{merchantName}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Amount</Label>
              <p className="text-lg font-bold text-primary">
                {amount} {currency}
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Payment Type</Label>
              <div className="flex items-center gap-1">
                <Send className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-500">Standard</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {step === "connect" && (
        <Card>
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>Connect your StarkNet wallet to proceed with the payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <StarkNetWalletConnector onWalletConnected={handleWalletConnected} />

            <div className="flex gap-3 pt-4">
              <Button onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "confirm" && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Payment</CardTitle>
            <CardDescription>Enter the recipient's address and confirm your payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="0x..."
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="font-mono text-sm"
              />
            </div>

            {wallet && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Connected Wallet</span>
                  <span className="font-mono">{starknetUtils.formatAddress(wallet.address)}</span>
                </div>
              </div>
            )}

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                This is a standard blockchain transaction. Your transaction will be publicly visible on the blockchain.
              </AlertDescription>
            </Alert>

            <div className="flex gap-3 pt-4">
              <Button onClick={onCancel} variant="outline" className="flex-1 bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handlePayment} disabled={!recipientAddress || isTransacting} className="flex-1">
                Pay {amount} {currency}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "processing" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Processing Payment
            </CardTitle>
            <CardDescription>Your payment is being processed on the StarkNet blockchain</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">
                {isProcessing ? "Processing payment..." : "Preparing transaction"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "complete" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-accent" />
              Payment Complete
            </CardTitle>
            <CardDescription>Your payment has been successfully processed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-accent">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Payment successful</span>
            </div>

            {txHash && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Transaction Hash</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs">{txHash.slice(0, 10)}...</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.open(starknetUtils.getExplorerUrl(txHash), "_blank")}
                      className="h-6 w-6 p-0"
                    >
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-medium">
                  {amount} {currency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Recipient</span>
                <span className="font-mono text-xs">{starknetUtils.formatAddress(recipientAddress)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="text-accent font-medium">Confirmed</span>
              </div>
            </div>

            <Button onClick={handleComplete} className="w-full">
              Complete
              <CheckCircle className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
