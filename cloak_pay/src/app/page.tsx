"use client"

import { useState } from "react"
import { MerchantCheckoutWidget } from "@/components/merchant-checkout-widget"
import { NormalPayment } from "@/components/normal-payment"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Shield, Lock, Zap, ArrowRight, Users, DollarSign } from "@/components/simple-icons"

export default function HomePage() {
  const router = useRouter()
  const [showNormalPayment, setShowNormalPayment] = useState(false)

  const handlePayPrivately = () => {
    console.log("[v0] Pay Privately button clicked, navigating to /sender")
    router.push("/sender")
  }

  const handlePayRegular = () => {
    console.log("[v0] Regular payment initiated")
    setShowNormalPayment(true)
  }

  const handleNormalPaymentComplete = (txHash: string) => {
    console.log("[v0] Normal payment completed:", txHash)
    setShowNormalPayment(false)
  }

  const handleNormalPaymentCancel = () => {
    setShowNormalPayment(false)
  }

  if (showNormalPayment) {
    return (
      <div className="min-h-screen bg-background py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <Button onClick={() => setShowNormalPayment(false)} variant="outline" className="bg-transparent">
              ← Back to Home
            </Button>
          </div>
          <NormalPayment
            amount="0.05"
            currency="ETH"
            merchantName="Demo Store"
            productName="Premium Widget"
            onComplete={handleNormalPaymentComplete}
            onCancel={handleNormalPaymentCancel}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="text-center space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance leading-tight">
                CloakPay
                <span className="block text-primary text-lg">Powered by StarkNet</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-muted-foreground text-pretty max-w-2xl mx-auto px-2">
                Experience secure, anonymous transactions using zero-knowledge proofs. Send and receive payments without
                revealing your identity.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm px-4">
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                <span className="whitespace-nowrap">Zero-Knowledge Proofs</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                <span className="whitespace-nowrap">Complete Anonymity</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                <span className="whitespace-nowrap">StarkNet Blockchain</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Try the Demo</h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Experience our privacy payment system with this interactive demo. See how easy it is to send anonymous
              payments using cryptographic commitments.
            </p>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  1
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base">Generate Secret</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Create a cryptographic commitment without revealing the payment details
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  2
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base">Deposit Funds</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Submit the commitment to StarkNet blockchain with zero-knowledge proof
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  3
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base">Share Secret</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Send the secret to the recipient who can then claim the funds anonymously
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center order-1 lg:order-2">
            <div className="w-full max-w-sm">
              <MerchantCheckoutWidget
                amount="0.05"
                currency="ETH"
                merchantName="Demo Store"
                productName="Premium Widget"
                onPayPrivately={handlePayPrivately}
                onPayRegular={handlePayRegular}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted/30 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Complete Privacy Solution</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
              Our system provides end-to-end privacy for digital payments using cutting-edge cryptographic techniques.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card className="h-full">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <span>For Senders</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Send payments without revealing your identity or transaction details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 pt-0">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                  <span>Generate cryptographic commitments</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                  <span>Deposit funds anonymously</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                  <span>Share secrets securely</span>
                </div>
                <Button
                  onClick={() => {
                    console.log("[v0] Start Sending button clicked")
                    router.push("/sender")
                  }}
                  className="w-full mt-3 sm:mt-4 text-sm"
                >
                  Start Sending
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="h-full">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <span>For Receivers</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Claim payments using secrets without revealing your identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 pt-0">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                  <span>Connect StarkNet wallet</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                  <span>Verify payment secrets</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                  <span>Withdraw funds anonymously</span>
                </div>
                <Button
                  onClick={() => {
                    console.log("[v0] Start Receiving button clicked")
                    router.push("/receiver")
                  }}
                  variant="outline"
                  className="w-full mt-3 sm:mt-4 bg-transparent text-sm"
                >
                  Start Receiving
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            <Card className="h-full sm:col-span-2 lg:col-span-1">
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                  <span>For Merchants</span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Integrate privacy payments into your checkout flow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 pt-0">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                  <span>Easy widget integration</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                  <span>Privacy-focused checkout</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                  <span>StarkNet compatibility</span>
                </div>
                <Button variant="outline" className="w-full mt-3 sm:mt-4 bg-transparent text-sm" disabled>
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4">Ready to Experience Private Payments?</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 px-2">
            Join the future of anonymous transactions powered by zero-knowledge proofs and StarkNet blockchain
            technology.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 max-w-md mx-auto">
            <Button
              onClick={() => {
                console.log("[v0] Send Payment CTA clicked")
                router.push("/sender")
              }}
              size="lg"
              className="w-full sm:w-auto px-6 sm:px-8 text-sm sm:text-base"
            >
              Send Payment
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-2" />
            </Button>
            <Button
              onClick={() => {
                console.log("[v0] Receive Payment CTA clicked")
                router.push("/receiver")
              }}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto px-6 sm:px-8 bg-transparent text-sm sm:text-base"
            >
              Receive Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}