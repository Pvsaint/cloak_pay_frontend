"use client"

import { Contract, RpcProvider, Account, ec, CallData, num } from "starknet"

// StarkNet configuration
export const STARKNET_CONFIG = {
  nodeUrl: "https://starknet-mainnet.public.blastapi.io",
  testnetUrl: "https://starknet-testnet.public.blastapi.io",
  contractAddress:
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7", // Example contract
  chainId: "SN_MAIN",
}

export interface StarkNetWallet {
  address: string
  publicKey: string
  isConnected: boolean
}

export interface DepositParams {
  commitment: string
  amount: string
  nullifier: string
}

export interface WithdrawParams {
  secret: string
  nullifier: string
  recipient: string
  amount: string
  merkleProof: string[]
}

export class StarkNetService {
  private provider: RpcProvider
  private account: Account | null = null
  private contract: Contract | null = null

  constructor(isTestnet = true) {
    this.provider = new RpcProvider({
      nodeUrl: isTestnet ? STARKNET_CONFIG.testnetUrl : STARKNET_CONFIG.nodeUrl,
    })
  }

  /**
   * Connect to StarkNet wallet (simulated for demo)
   */
  async connectWallet(): Promise<StarkNetWallet> {
    try {
      const privateKey = ec.starkCurve.utils.randomPrivateKey()
      const publicKey = ec.starkCurve.getStarkKey(privateKey)
      const address = `0x${publicKey.slice(2, 42)}`

      this.account = new Account(this.provider, address, privateKey)

      return {
        address,
        publicKey: `0x${publicKey}`,
        isConnected: true,
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw new Error("Failed to connect to StarkNet wallet")
    }
  }

  /**
   * Initialize the privacy payment contract
   */
  async initializeContract(contractAddress: string, abi: any[]): Promise<void> {
    if (!this.account) {
      throw new Error("Wallet not connected")
    }

    this.contract = new Contract(abi, contractAddress, this.provider)
    this.contract.connect(this.account)
  }

  /**
   * Deposit funds with commitment
   */
  async deposit(params: DepositParams): Promise<string> {
    if (!this.contract || !this.account) {
      throw new Error("Contract not initialized or wallet not connected")
    }

    try {
      const callData = CallData.compile({
        commitment: params.commitment,
        amount: num.toHex(params.amount),
        nullifier: params.nullifier,
      })

      const result = await this.contract.invoke("deposit", callData)
      await this.provider.waitForTransaction(result.transaction_hash)

      return result.transaction_hash
    } catch (error) {
      console.error("Deposit failed:", error)
      throw new Error("Failed to deposit funds to StarkNet")
    }
  }

  /**
   * Withdraw funds using secret
   */
  async withdraw(params: WithdrawParams): Promise<string> {
    if (!this.contract || !this.account) {
      throw new Error("Contract not initialized or wallet not connected")
    }

    try {
      const callData = CallData.compile({
        secret: params.secret,
        nullifier: params.nullifier,
        recipient: params.recipient,
        amount: num.toHex(params.amount),
        merkle_proof: params.merkleProof,
      })

      const result = await this.contract.invoke("withdraw", callData)
      await this.provider.waitForTransaction(result.transaction_hash)

      return result.transaction_hash
    } catch (error) {
      console.error("Withdrawal failed:", error)
      throw new Error("Failed to withdraw funds from StarkNet")
    }
  }

  /**
 * Get commitment status from blockchain
 */
async getCommitmentStatus(commitment: string): Promise<{
  exists: boolean
  amount: string
  timestamp: number
  isSpent: boolean
}> {
  if (!this.contract) {
    throw new Error("Contract not initialized")
  }

  try {
    // StarkNet returns tuple results, not objects
    const [exists, amount, timestamp, isSpent] = (await this.contract.call(
      "get_commitment_status",
      [commitment]
    )) as [boolean, bigint, bigint, boolean]

    return {
      exists: Boolean(exists),
      amount: num.toHex(amount),
      timestamp: Number(timestamp),
      isSpent: Boolean(isSpent),
    }
  } catch (error) {
    console.error("Failed to get commitment status:", error)
    throw new Error("Failed to query commitment status")
  }
}

  /**
   * Get account balance
   */
  async getBalance(address: string): Promise<string> {
    try {
      const mockBalance = (Math.random() * 10).toFixed(6)
      return starknetUtils.ethToWei(mockBalance)
    } catch (error) {
      console.error("Failed to get balance:", error)
      return starknetUtils.ethToWei("1.5")
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(txHash: string): Promise<any> {
  try {
    const tx = await this.provider.getTransaction(txHash)
    const receipt = await this.provider.getTransactionReceipt(txHash)

    return {
      transaction: tx,
      receipt,
      status: (receipt as any).status ?? "UNKNOWN", // safe fallback
    }
  } catch (error) {
    console.error("Failed to get transaction:", error)
    throw new Error("Failed to get transaction details")
  }
}

  /**
   * Estimate transaction fee
   */
  async estimateFee(
    contractAddress: string,
    entrypoint: string,
    calldata: any[]
  ): Promise<string> {
    if (!this.account) {
      throw new Error("Wallet not connected")
    }

    try {
      const estimate = await this.account.estimateFee({
        contractAddress,
        entrypoint,
        calldata,
      })

      return num.toHex(estimate.overall_fee)
    } catch (error) {
      console.error("Failed to estimate fee:", error)
      throw new Error("Failed to estimate transaction fee")
    }
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.account = null
    this.contract = null
  }
}

// Privacy Payment Contract ABI (simplified for demo)
export const PRIVACY_PAYMENT_ABI = [
  {
    name: "deposit",
    type: "function",
    inputs: [
      { name: "commitment", type: "felt" },
      { name: "amount", type: "Uint256" },
      { name: "nullifier", type: "felt" },
    ],
    outputs: [],
    stateMutability: "external",
  },
  {
    name: "withdraw",
    type: "function",
    inputs: [
      { name: "secret", type: "felt" },
      { name: "nullifier", type: "felt" },
      { name: "recipient", type: "felt" },
      { name: "amount", type: "Uint256" },
      { name: "merkle_proof", type: "felt*" },
    ],
    outputs: [],
    stateMutability: "external",
  },
  {
    name: "get_commitment_status",
    type: "function",
    inputs: [{ name: "commitment", type: "felt" }],
    outputs: [
      { name: "exists", type: "bool" },
      { name: "amount", type: "Uint256" },
      { name: "timestamp", type: "felt" },
      { name: "is_spent", type: "bool" },
    ],
    stateMutability: "view",
  },
]

// Utility functions for StarkNet integration
export const starknetUtils = {
  formatAddress: (address: string): string => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  },

  weiToEth: (wei: string): string => {
    const ethValue = Number(wei) / Math.pow(10, 18)
    return ethValue.toFixed(6)
  },

  ethToWei: (eth: string): string => {
    const weiValue = Number(eth) * Math.pow(10, 18)
    return weiValue.toString()
  },

  isValidAddress: (address: string): boolean => {
    return /^0x[0-9a-fA-F]{63,64}$/.test(address)
  },

  getExplorerUrl: (txHash: string, isTestnet = true): string => {
    const baseUrl = isTestnet
      ? "https://testnet.starkscan.co"
      : "https://starkscan.co"
    return `${baseUrl}/tx/${txHash}`
  },
}