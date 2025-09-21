"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Shield } from "lucide-react"
import { useCrypto } from "@/hooks/use-crypto"

interface ClaimPaymentProps {
  onSuccess: (txHash: string) => void
  onError: (error: string) => void
}

export function ClaimPayment({ onSuccess, onError }: ClaimPaymentProps) {
  const [secret, setSecret] = useState("")
  const [amount, setAmount] = useState("")
  const [commitment, setCommitment] = useState("")
  const [nullifier, setNullifier] = useState("")
  const [isClaiming, setIsClaiming] = useState(false)

  const { verifyPaymentSecret, isVerifying } = useCrypto()

  const handleClaim = async () => {
    if (!secret || !amount || !commitment || !nullifier) {
      onError("Please fill in all required fields")
      return
    }

    setIsClaiming(true)
    try {
      // Verify the secret matches the commitment
      const isValid = await verifyPaymentSecret(secret, commitment, amount, nullifier)

      if (!isValid) {
        throw new Error("Invalid secret or commitment")
      }

      // Simulate blockchain withdrawal
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`
      onSuccess(txHash)
    } catch (error) {
      onError(error instanceof Error ? error.message : "Failed to claim payment")
    } finally {
      setIsClaiming(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Claim Payment
        </CardTitle>
        <CardDescription>Enter the payment details to claim your funds</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="secret">Payment Secret</Label>
          <Input
            id="secret"
            placeholder="0x..."
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            placeholder="0.05"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            step="0.001"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="commitment">Commitment</Label>
          <Input
            id="commitment"
            placeholder="0x..."
            value={commitment}
            onChange={(e) => setCommitment(e.target.value)}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nullifier">Nullifier</Label>
          <Input
            id="nullifier"
            placeholder="0x..."
            value={nullifier}
            onChange={(e) => setNullifier(e.target.value)}
            className="font-mono text-sm"
          />
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your withdrawal will be processed anonymously using zero-knowledge proofs.
          </AlertDescription>
        </Alert>

        <Button
          onClick={handleClaim}
          disabled={!secret || !amount || !commitment || !nullifier || isClaiming || isVerifying}
          className="w-full"
        >
          {isClaiming || isVerifying ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {isVerifying ? "Verifying..." : "Claiming..."}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Claim Funds
            </div>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
