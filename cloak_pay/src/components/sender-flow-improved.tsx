"use client"

import { useState } from "react"
import {
  Shield,
  Lock,
  Key,
  Copy,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Info,
  Wallet,
  Eye,
  EyeOff,
  Download,
  Share2,
  AlertCircle,
  Clock,
  X,
  ExternalLink,
} from "lucide-react"

interface PaymentSecret {
  secret: string
  commitment: string
  nullifier: string
}

interface SenderFlowProps {
  amount: string
  currency: string
  merchantName: string
  productName: string
  onComplete: (data: { secret: string; commitment: string; shareableLink: string; txHash: string }) => void
  onCancel: () => void
}

type FlowStep = "connect" | "confirm" | "generating" | "depositing" | "sharing"

export default function SenderFlow({
  amount,
  currency,
  merchantName,
  productName,
  onComplete,
  onCancel,
}: SenderFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>("connect")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [paymentSecret, setPaymentSecret] = useState<PaymentSecret | null>(null)
  const [shareableLink, setShareableLink] = useState("")
  const [txHash, setTxHash] = useState("")
  const [copied, setCopied] = useState<string>("")
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isTransacting, setIsTransacting] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const [error, setError] = useState("")
  const [estimatedGasFee, setEstimatedGasFee] = useState("0.0012")

  const steps = [
    { id: "connect", title: "Connect", description: "Link wallet", icon: Wallet },
    { id: "confirm", title: "Confirm", description: "Review details", icon: CheckCircle },
    { id: "generating", title: "Generate", description: "Create proof", icon: Key },
    { id: "depositing", title: "Deposit", description: "Submit funds", icon: Shield },
    { id: "sharing", title: "Share", description: "Send secret", icon: Share2 },
  ]

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  // Mock wallet connection
  const connectWallet = async () => {
    setIsTransacting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnected(true)
    setWalletAddress("0x1234567890123456789012345678901234567890")
    setIsTransacting(false)
    setCurrentStep("confirm")
  }

  const handleGenerateSecret = async () => {
    try {
      setError("")
      setIsGenerating(true)

      // Simulate secret generation
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const mockSecret = {
        secret: "0x" + Math.random().toString(16).substring(2, 66),
        commitment: "0x" + Math.random().toString(16).substring(2, 66),
        nullifier: "0x" + Math.random().toString(16).substring(2, 66),
      }

      setPaymentSecret(mockSecret)
      setIsGenerating(false)

      // Auto-proceed to deposit
      setTimeout(() => {
        setCurrentStep("depositing")
        handleDepositFunds(mockSecret)
      }, 1500)
    } catch (error: any) {
      setError("Failed to generate secret: " + error.message)
      setIsGenerating(false)
    }
  }

  const handleDepositFunds = async (secret?: PaymentSecret) => {
    const secretToUse = secret || paymentSecret
    if (!secretToUse || !isConnected) return

    try {
      setIsTransacting(true)

      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 4000))

      const mockTxHash = "0x" + Math.random().toString(16).substring(2, 66)
      const mockLink = `https://privatepay.app/claim/${secretToUse.commitment}`

      setTxHash(mockTxHash)
      setShareableLink(mockLink)
      setIsTransacting(false)
      setCurrentStep("sharing")
    } catch (error: any) {
      setError("Failed to deposit funds: " + error.message)
      setIsTransacting(false)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(""), 2000)
  }

  const generateQRCode = (text: string) => {
    // Mock QR code as a simple pattern
    return (
      <div className="w-40 h-40 bg-gray-900 p-4 rounded-lg flex items-center justify-center">
        <div className="grid grid-cols-8 gap-1">
          {Array.from({ length: 64 }, (_, i) => (
            <div key={i} className={`w-2 h-2 ${Math.random() > 0.5 ? "bg-white" : "bg-gray-900"} rounded-sm`} />
          ))}
        </div>
      </div>
    )
  }

  const handleComplete = () => {
    if (!paymentSecret) return
    onComplete({
      secret: paymentSecret.secret,
      commitment: paymentSecret.commitment,
      shareableLink,
      txHash,
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Private Payment</h1>
          <p className="text-gray-600 dark:text-gray-400">Send funds anonymously using zero-knowledge proofs</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Progress Steps */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Progress</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
        </div>

        <div className="relative">
          <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-600"></div>
          <div
            className="absolute top-5 left-0 h-0.5 bg-blue-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>

          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              const isActive = index === currentStepIndex
              const isCompleted = index < currentStepIndex

              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-green-500 border-green-500 text-white"
                        : isActive
                          ? "bg-blue-500 border-blue-500 text-white animate-pulse"
                          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400"
                    }
                  `}
                  >
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <StepIcon className="h-5 w-5" />}
                  </div>
                  <div className="mt-2 text-center">
                    <p
                      className={`text-xs font-medium ${isActive || isCompleted ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Details</h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Product</p>
            <p className="font-medium text-gray-900 dark:text-white">{productName}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Merchant</p>
            <p className="font-medium text-gray-900 dark:text-white">{merchantName}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {amount} {currency}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Privacy Level</p>
            <div className="flex items-center gap-1">
              <Lock className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">Maximum</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        {currentStep === "connect" && (
          <div className="space-y-6">
            <div className="text-center">
              <Wallet className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Connect Your Wallet</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Connect your StarkNet wallet to proceed with the private payment. Your wallet will be used to sign
                transactions.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-blue-800 dark:text-blue-200 font-medium">Privacy Features</p>
                  <ul className="text-blue-700 dark:text-blue-300 text-sm mt-1 space-y-1">
                    <li>• Zero-knowledge proofs protect your identity</li>
                    <li>• Transaction amounts remain private</li>
                    <li>• No direct link between sender and receiver</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={connectWallet}
                disabled={isTransacting}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                {isTransacting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Wallet className="h-5 w-5" />
                )}
                {isTransacting ? "Connecting..." : "Connect Wallet"}
              </button>
            </div>
          </div>
        )}

        {currentStep === "confirm" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Confirm Payment</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Review the payment details and enter the recipient's address to proceed.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recipient Address
                </label>
                <input
                  type="text"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {isConnected && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Connected Wallet</span>
                    <span className="font-mono text-sm text-gray-900 dark:text-white">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </span>
                  </div>
                </div>
              )}

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-green-800 dark:text-green-200 font-medium">Estimated Gas Fee</p>
                    <p className="text-green-700 dark:text-green-300 text-sm">{estimatedGasFee} ETH</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={() => setCurrentStep("generating")}
                disabled={!recipientAddress.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {currentStep === "generating" && (
          <div className="space-y-6">
            <div className="text-center">
              <Key className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Generating Cryptographic Proof
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Creating zero-knowledge proof to ensure your payment privacy...
              </p>
            </div>

            {!paymentSecret ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {isGenerating ? "Generating cryptographic secret..." : "Ready to generate secret"}
                </p>
                {!isGenerating && (
                  <button
                    onClick={handleGenerateSecret}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors"
                  >
                    Generate Secret
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Secret generated successfully</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Secret</label>
                      <button
                        onClick={() => setShowSecret(!showSecret)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg font-mono text-sm break-all">
                      {showSecret ? paymentSecret.secret : "•".repeat(50)}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Public Commitment
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg font-mono text-sm break-all">
                      {paymentSecret.commitment}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nullifier Hash
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg font-mono text-sm break-all">
                      {paymentSecret.nullifier}
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-blue-800 dark:text-blue-200 text-sm">
                        The secret will be shared with the recipient after the funds are deposited. Keep this
                        information secure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === "depositing" && (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Depositing Funds</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Submitting your commitment to the StarkNet blockchain...
              </p>
            </div>

            {!txHash ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  {isTransacting ? "Processing blockchain transaction..." : "Initiating deposit..."}
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>This may take a few moments</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Funds deposited successfully!</span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Transaction Hash</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-gray-900 dark:text-white">
                        {txHash.slice(0, 10)}...{txHash.slice(-6)}
                      </span>
                      <button
                        onClick={() => window.open(`https://starkscan.co/tx/${txHash}`, "_blank")}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-blue-800 dark:text-blue-200 font-medium">Payment Committed</p>
                      <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                        Your payment has been committed to the blockchain. Share the secret with the recipient to
                        complete the transaction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === "sharing" && paymentSecret && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Share Payment Secret</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Send this information to the recipient so they can claim the funds.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Shareable Link
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={shareableLink}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => copyToClipboard(shareableLink, "link")}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {copied === "link" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Secret
                  </label>
                  <div className="flex gap-2">
                    <input
                      value={paymentSecret.secret}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-xs text-gray-900 dark:text-white"
                    />
                    <button
                      onClick={() => copyToClipboard(paymentSecret.secret, "secret")}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {copied === "secret" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
                    <Share2 className="h-4 w-4" />
                    Share Link
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Download className="h-4 w-4" />
                    Save QR
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">QR Code</label>
                <div className="bg-white p-4 rounded-lg border">{generateQRCode(shareableLink)}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Recipient can scan this QR code to access the payment
                </p>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-amber-800 dark:text-amber-200 font-medium">Important Security Notice</p>
                  <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                    The recipient needs this secret to withdraw the funds. Only share it with the intended recipient
                    through a secure channel.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors"
              >
                Complete Payment
                <CheckCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
