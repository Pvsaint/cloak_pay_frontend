"use client"

import { useState } from "react"
import {
  Wallet,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  Copy,
  ExternalLink,
  Shield,
  TrendingUp,
  DollarSign,
  RefreshCw,
  Eye,
  EyeOff,
  X,
} from "lucide-react"

interface Transaction {
  id: string
  amount: string
  currency: string
  status: "pending" | "completed" | "failed"
  timestamp: number
  secret?: string
  commitment: string
  nullifier: string
  txHash?: string
  sender?: string
}

const ReceiverDashboard = () => {
  const [secret, setSecret] = useState("")
  const [showSecret, setShowSecret] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "1",
      amount: "0.05",
      currency: "ETH",
      status: "pending",
      timestamp: Date.now() - 3600000,
      commitment: "0x1234567890abcdef1234567890abcdef12345678",
      nullifier: "0xabcdef1234567890abcdef1234567890abcdef12",
      sender: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    },
    {
      id: "2",
      amount: "0.1",
      currency: "ETH",
      status: "completed",
      timestamp: Date.now() - 86400000,
      commitment: "0x9876543210fedcba9876543210fedcba98765432",
      nullifier: "0xfedcba9876543210fedcba9876543210fedcba98",
      txHash: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890ab",
      sender: "0x8ba1f109551bD432803012645Hac136c30c6c3c6",
    },
    {
      id: "3",
      amount: "0.25",
      currency: "ETH",
      status: "failed",
      timestamp: Date.now() - 172800000,
      commitment: "0x5555666677778888999900001111222233334444",
      nullifier: "0x4444333322221111000099998888777766665555",
      sender: "0x9cb2f102441bd032803012645Hac136c30c6c3c7",
    },
  ])
  const [copied, setCopied] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isTransacting, setIsTransacting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [activeTab, setActiveTab] = useState("withdraw")

  // Mock wallet connection
  const connectWallet = async () => {
    setIsTransacting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsConnected(true)
    setWalletAddress("0x1234567890123456789012345678901234567890")
    setIsTransacting(false)
    setSuccess("Wallet connected successfully!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress("")
  }

  const totalBalance = transactions
    .filter((tx) => tx.status === "completed")
    .reduce((sum, tx) => sum + Number.parseFloat(tx.amount), 0)

  const pendingBalance = transactions
    .filter((tx) => tx.status === "pending")
    .reduce((sum, tx) => sum + Number.parseFloat(tx.amount), 0)

  const failedBalance = transactions
    .filter((tx) => tx.status === "failed")
    .reduce((sum, tx) => sum + Number.parseFloat(tx.amount), 0)

  const handleWithdraw = async () => {
    if (!secret.trim() || !isConnected) return

    setError("")
    setIsVerifying(true)

    try {
      // Simulate verification
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Find matching transaction by trying to verify the secret
      const pendingTx = transactions.find((tx) => tx.status === "pending")
      if (!pendingTx) {
        throw new Error("No pending transactions found")
      }

      // Validate secret format - should be 0x followed by 64 hex characters
      const hexPattern = /^0x[a-fA-F0-9]{64}$/
      if (!hexPattern.test(secret)) {
        throw new Error("Invalid secret format. Secret should be a 66-character hex string starting with '0x'")
      }

      setIsVerifying(false)
      setIsTransacting(true)

      // Simulate withdrawal
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const txHash = "0x" + Math.random().toString(16).substring(2, 66)

      // Update transaction status
      setTransactions((prev) =>
        prev.map((tx) =>
          tx.id === pendingTx.id
            ? {
                ...tx,
                status: "completed" as const,
                txHash,
                secret,
              }
            : tx,
        ),
      )

      setSecret("")
      setSuccess(`Successfully withdrew ${pendingTx.amount} ${pendingTx.currency}!`)
      setTimeout(() => setSuccess(""), 5000)
      setActiveTab("history")
    } catch (error: any) {
      setError(error.message || "Withdrawal failed")
    } finally {
      setIsTransacting(false)
      setIsVerifying(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    }
  }

  const clearMessages = () => {
    setError("")
    setSuccess("")
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Receiver Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your private payments and claim funds securely</p>
        </div>

        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-3 bg-card rounded-lg p-3 border">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-foreground">Connected</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              </div>
              <button onClick={disconnectWallet} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isTransacting}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg disabled:opacity-50 transition-colors"
            >
              {isTransacting ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Wallet className="h-4 w-4" />
              )}
              {isTransacting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
          <div className="flex-1">
            <p className="text-destructive">{error}</p>
          </div>
          <button onClick={clearMessages} className="text-destructive/60 hover:text-destructive">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-green-700 dark:text-green-300">{success}</p>
          </div>
          <button onClick={clearMessages} className="text-green-500/60 hover:text-green-500">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Available Balance</h3>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalBalance.toFixed(4)} ETH</div>
          <p className="text-xs text-muted-foreground mt-1">Ready to withdraw</p>
        </div>

        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Pending Claims</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingBalance.toFixed(4)} ETH</div>
          <p className="text-xs text-muted-foreground mt-1">Awaiting withdrawal</p>
        </div>

        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Failed Transactions</h3>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{failedBalance.toFixed(4)} ETH</div>
          <p className="text-xs text-muted-foreground mt-1">Need attention</p>
        </div>

        <div className="bg-card rounded-lg p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Transactions</h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold text-foreground">{transactions.length}</div>
          <p className="text-xs text-muted-foreground mt-1">All time</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-lg border">
        <div className="border-b border-border">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab("withdraw")}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "withdraw"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Withdraw Funds
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "history"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Transaction History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "withdraw" && (
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Download className="h-5 w-5 text-primary mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Claim Private Payment</h3>
                  <p className="text-muted-foreground">
                    Enter the secret you received to claim your funds. The secret will be verified against the
                    blockchain commitment.
                  </p>
                </div>
              </div>

              {!isConnected ? (
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
                  <Wallet className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-primary font-medium">Wallet Required</p>
                    <p className="text-primary/80 text-sm mt-1">
                      Connect your StarkNet wallet to withdraw funds. Your wallet will be used to sign the withdrawal
                      transaction.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-green-700 dark:text-green-300 font-medium">How to receive funds</p>
                      <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                        Ask the sender to share their payment secret with you. Enter it below to claim your private
                        payment.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="secret" className="block text-sm font-medium text-foreground">
                      Payment Secret
                    </label>
                    <div className="relative">
                      <input
                        id="secret"
                        type={showSecret ? "text" : "password"}
                        placeholder="Enter the secret shared by the sender (0x...)"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-input rounded-lg bg-background text-foreground font-mono text-sm focus:ring-2 focus:ring-ring focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                      >
                        {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      The sender will provide you with a secret key or shareable link to claim your payment
                    </p>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-muted rounded-lg border">
                    <Shield className="h-5 w-5 text-primary" />
                    <div className="text-sm">
                      <p className="font-medium text-foreground">Privacy Protected</p>
                      <p className="text-muted-foreground">
                        Your identity remains anonymous throughout the withdrawal process
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleWithdraw}
                    disabled={!secret.trim() || isTransacting || isVerifying}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    {isTransacting || isVerifying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        {isVerifying ? "Verifying Secret..." : "Processing Withdrawal..."}
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Withdraw Funds
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Transaction History</h3>
                <button className="flex items-center gap-2 text-sm text-primary hover:text-primary/80">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Commitment</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-muted/50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(tx.status)}
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}
                            >
                              {tx.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-foreground">
                          {tx.amount} {tx.currency}
                        </td>
                        <td className="py-4 px-4 text-sm text-muted-foreground">{formatTimestamp(tx.timestamp)}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground">
                              {tx.commitment.slice(0, 10)}...
                            </span>
                            <button
                              onClick={() => copyToClipboard(tx.commitment)}
                              className="p-1 text-muted-foreground hover:text-foreground rounded"
                            >
                              {copied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {tx.txHash && (
                            <button
                              onClick={() => window.open(`https://starkscan.co/tx/${tx.txHash}`, "_blank")}
                              className="p-1 text-muted-foreground hover:text-foreground rounded"
                              title="View on Explorer"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReceiverDashboard
export { ReceiverDashboard }
