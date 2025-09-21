"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { StarkNetService, type StarkNetWallet, type DepositParams, type WithdrawParams } from "@/lib/starknet"

interface StarkNetContextType {
  wallet: StarkNetWallet | null
  balance: string
  isConnecting: boolean
  isTransacting: boolean
  connectWallet: () => Promise<StarkNetWallet>
  disconnectWallet: () => void
  deposit: (params: DepositParams) => Promise<string>
  withdraw: (params: WithdrawParams) => Promise<string>
  getCommitmentStatus: (commitment: string) => Promise<any>
  getTransaction: (txHash: string) => Promise<any>
  refreshBalance: () => Promise<void>
}

const StarkNetContext = createContext<StarkNetContextType | null>(null)

export function StarkNetProvider({ children }: { children: ReactNode }) {
  const [starknetService] = useState(() => new StarkNetService(true)) // Use testnet
  const [wallet, setWallet] = useState<StarkNetWallet | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isTransacting, setIsTransacting] = useState(false)
  const [balance, setBalance] = useState<string>("0")

  const connectWallet = useCallback(async () => {
    setIsConnecting(true)
    try {
      const connectedWallet = await starknetService.connectWallet()
      setWallet(connectedWallet)

      // Get initial balance
      const walletBalance = await starknetService.getBalance(connectedWallet.address)
      setBalance(walletBalance)

      console.log("[v0] StarkNet Context - wallet connected:", connectedWallet)
      return connectedWallet
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }, [starknetService])

  const disconnectWallet = useCallback(() => {
    starknetService.disconnect()
    setWallet(null)
    setBalance("0")
    console.log("[v0] StarkNet Context - wallet disconnected")
  }, [starknetService])

  const deposit = useCallback(
    async (params: DepositParams): Promise<string> => {
      if (!wallet) {
        throw new Error("Wallet not connected")
      }

      setIsTransacting(true)
      try {
        const txHash = await starknetService.deposit(params)

        // Update balance after successful deposit
        const newBalance = await starknetService.getBalance(wallet.address)
        setBalance(newBalance)

        return txHash
      } catch (error) {
        console.error("Deposit failed:", error)
        throw error
      } finally {
        setIsTransacting(false)
      }
    },
    [starknetService, wallet],
  )

  const withdraw = useCallback(
    async (params: WithdrawParams): Promise<string> => {
      if (!wallet) {
        throw new Error("Wallet not connected")
      }

      setIsTransacting(true)
      try {
        const txHash = await starknetService.withdraw(params)

        // Update balance after successful withdrawal
        const newBalance = await starknetService.getBalance(wallet.address)
        setBalance(newBalance)

        return txHash
      } catch (error) {
        console.error("Withdrawal failed:", error)
        throw error
      } finally {
        setIsTransacting(false)
      }
    },
    [starknetService, wallet],
  )

  const getCommitmentStatus = useCallback(
    async (commitment: string) => {
      return await starknetService.getCommitmentStatus(commitment)
    },
    [starknetService],
  )

  const getTransaction = useCallback(
    async (txHash: string) => {
      return await starknetService.getTransaction(txHash)
    },
    [starknetService],
  )

  const refreshBalance = useCallback(async () => {
    if (!wallet) return

    try {
      const newBalance = await starknetService.getBalance(wallet.address)
      setBalance(newBalance)
    } catch (error) {
      console.error("Failed to refresh balance:", error)
    }
  }, [starknetService, wallet])

  // Auto-refresh balance every 30 seconds when wallet is connected
  useEffect(() => {
    if (!wallet) return

    const interval = setInterval(refreshBalance, 30000)
    return () => clearInterval(interval)
  }, [wallet, refreshBalance])

  const value: StarkNetContextType = {
    wallet,
    balance,
    isConnecting,
    isTransacting,
    connectWallet,
    disconnectWallet,
    deposit,
    withdraw,
    getCommitmentStatus,
    getTransaction,
    refreshBalance,
  }

  return <StarkNetContext.Provider value={value}>{children}</StarkNetContext.Provider>
}

export function useStarkNet() {
  const context = useContext(StarkNetContext)
  if (!context) {
    throw new Error("useStarkNet must be used within a StarkNetProvider")
  }
  return context
}
