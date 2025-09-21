"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Zap } from "@/components/simple-icons"

interface MerchantCheckoutWidgetProps {
  amount: string
  currency?: string
  merchantName: string
  productName: string
  onPayPrivately: () => void
  onPayRegular?: () => void
}

export function MerchantCheckoutWidget({
  amount,
  currency = "ETH",
  merchantName,
  productName,
  onPayPrivately,
  onPayRegular,
}: MerchantCheckoutWidgetProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayPrivately = async () => {
    setIsProcessing(true)
    try {
      await onPayPrivately()
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-2 border-primary/20 shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="h-5 w-5 text-primary" />
          <Badge variant="secondary" className="text-xs font-medium">
            Privacy Protected
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-balance">{productName}</CardTitle>
        <CardDescription className="text-muted-foreground">from {merchantName}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary mb-1">
            {amount} {currency}
          </div>
          <p className="text-sm text-muted-foreground">Total amount</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handlePayPrivately}
            disabled={isProcessing}
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Pay Privately
              </div>
            )}
          </Button>

          {onPayRegular && (
            <Button onClick={onPayRegular} variant="outline" className="w-full h-10 text-sm bg-transparent">
              Pay Normally
            </Button>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3" />
            <span>Zero-knowledge</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="h-3 w-3" />
            <span>Anonymous</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>StarkNet</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
