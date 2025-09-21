"use client"

import { useState, useCallback } from "react"
import {
  createPaymentSecret,
  verifyCommitment,
  generateShareableLink,
  generateZKProof,
  verifyZKProof,
  type PaymentSecret,
} from "../lib/crypto"

export function useCrypto() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  const generatePaymentSecret = useCallback(async (amount: string): Promise<PaymentSecret> => {
    setIsGenerating(true)

    // Simulate async cryptographic operations
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const paymentSecret = createPaymentSecret(amount)
    setIsGenerating(false)

    return paymentSecret
  }, [])

  const verifyPaymentSecret = useCallback(
    async (secret: string, commitment: string, amount: string, nullifier: string): Promise<boolean> => {
      setIsVerifying(true)

      // Simulate async verification
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const isValid = verifyCommitment(secret, commitment, amount, nullifier)
      setIsVerifying(false)

      return isValid
    },
    [],
  )

  const createShareableLink = useCallback((commitment: string): string => {
    return generateShareableLink(commitment)
  }, [])

  const generateProof = useCallback(async (secret: string, commitment: string, amount: string) => {
    setIsGenerating(true)

    // Simulate ZK proof generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const proof = generateZKProof(secret, commitment, amount)
    setIsGenerating(false)

    return proof
  }, [])

  const verifyProof = useCallback(
    async (proof: string, publicInputs: string[], expectedCommitment: string): Promise<boolean> => {
      setIsVerifying(true)

      // Simulate proof verification
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const isValid = verifyZKProof(proof, publicInputs, expectedCommitment)
      setIsVerifying(false)

      return isValid
    },
    [],
  )

  return {
    generatePaymentSecret,
    verifyPaymentSecret,
    createShareableLink,
    generateProof,
    verifyProof,
    isGenerating,
    isVerifying,
  }
}
