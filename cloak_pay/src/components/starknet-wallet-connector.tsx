"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "../components/ui/badge"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Wallet, ExternalLink, Copy, CheckCircle, AlertCircle } from "lucide-react"
import { useStarkNet } from "@/hooks/use-starknet"
import { starknetUtils } from "@/lib/starknet"

interface StarkNetWalletConnectorProps {
  onWalletConnected?: (address: string) => void
}

export function StarkNetWalletConnector({ onWalletConnected }: StarkNetWalletConnectorProps) {
  const { wallet, balance, isConnecting, connectWallet, disconnectWallet } = useStarkNet()
  const [copied, setCopied] = useState(false)

  const handleConnect = async () => {
    try {
      const connectedWallet = await connectWallet()
      onWalletConnected?.(connectedWallet.address)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    }
  }

  const copyAddress = async () => {
    if (!wallet) return
    await navigator.clipboard.writeText(wallet.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!wallet) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect StarkNet Wallet
          </CardTitle>
          <CardDescription>Connect your StarkNet wallet to send and receive private payments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This demo uses a simulated StarkNet connection. In production, this would integrate with wallets like
              ArgentX or Braavos.
            </AlertDescription>
          </Alert>

          <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
            {isConnecting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Connecting...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Connect Wallet
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Wallet Connected
          </div>
          <Badge variant="secondary" className="bg-accent/10 text-accent">
            StarkNet
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Address</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm">{starknetUtils.formatAddress(wallet.address)}</span>
              <Button size="sm" variant="ghost" onClick={copyAddress} className="h-6 w-6 p-0">
                {copied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Balance</span>
            <span className="font-medium">{starknetUtils.weiToEth(balance)} ETH</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <ExternalLink className="h-3 w-3 mr-1" />
            Explorer
          </Button>
          <Button onClick={disconnectWallet} variant="outline" size="sm" className="flex-1 bg-transparent">
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
