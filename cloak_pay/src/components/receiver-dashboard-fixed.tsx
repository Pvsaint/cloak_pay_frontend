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

export default function ReceiverDashboard() {
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

      // Simulate secret verification
      if (secret.length < 20) {
        throw new Error("Invalid secret format")
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
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Receiver Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your private payments and claim funds securely</p>
        </div>

        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-3 border">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Connected</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </p>
              </div>
              <button onClick={disconnectWallet} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              disabled={isTransacting}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-colors"
            >
              {isTransacting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
          <button onClick={clearMessages} className="text-red-400 hover:text-red-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
          <div className="flex-1">
            <p className="text-green-800 dark:text-green-200">{success}</p>
          </div>
          <button onClick={clearMessages} className="text-green-400 hover:text-green-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Balance</h3>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalBalance.toFixed(4)} ETH</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ready to withdraw</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Claims</h3>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingBalance.toFixed(4)} ETH</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Awaiting withdrawal</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed Transactions</h3>
            <AlertCircle className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">{failedBalance.toFixed(4)} ETH</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Need attention</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transactions</h3>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{transactions.length}</div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All time</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab("withdraw")}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "withdraw"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              Withdraw Funds
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "history"
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
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
                <Download className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Claim Private Payment</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Enter the secret you received to claim your funds. The secret will be verified against the
                    blockchain commitment.
                  </p>
                </div>
              </div>

              {!isConnected ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
                  <Wallet className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-blue-800 dark:text-blue-200 font-medium">Wallet Required</p>
                    <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                      Connect your StarkNet wallet to withdraw funds. Your wallet will be used to sign the withdrawal
                      transaction.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
                    <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-green-800 dark:text-green-200 font-medium">How to receive funds</p>
                      <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                        Ask the sender to share their payment secret with you. Enter it below to claim your private
                        payment.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="secret" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Payment Secret
                    </label>
                    <div className="relative">
                      <input
                        id="secret"
                        type={showSecret ? "text" : "password"}
                        placeholder="Enter the secret shared by the sender (0x...)"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      The sender will provide you with a secret key or shareable link to claim your payment
                    </p>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900 dark:text-white">Privacy Protected</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Your identity remains anonymous throughout the withdrawal process
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleWithdraw}
                    disabled={!secret.trim() || isTransacting || isVerifying}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    {isTransacting || isVerifying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction History</h3>
                <button className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Commitment
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
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
                        <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">
                          {tx.amount} {tx.currency}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatTimestamp(tx.timestamp)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-gray-600 dark:text-gray-400">
                              {tx.commitment.slice(0, 10)}...
                            </span>
                            <button
                              onClick={() => copyToClipboard(tx.commitment)}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded"
                            >
                              {copied ? <CheckCircle className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {tx.txHash && (
                            <button
                              onClick={() => window.open(`https://starkscan.co/tx/${tx.txHash}`, "_blank")}
                              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded"
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
