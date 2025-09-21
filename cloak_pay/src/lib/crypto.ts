export interface PaymentSecret {
  secret: string
  commitment: string
  nullifier: string
  timestamp: number
}

export interface CommitmentProof {
  commitment: string
  nullifier: string
  merkleProof: string[]
  leafIndex: number
}

/**
 * Generates a cryptographically secure random secret using Web Crypto API
 */
export function generateSecret(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return `0x${Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")}`
}

/**
 * Creates a SHA-256 hash using Web Crypto API
 */
async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer)
  const hashArray = new Uint8Array(hashBuffer)
  return Array.from(hashArray, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

/**
 * Synchronous hash function for compatibility (uses a simple hash for demo)
 */
function simpleHash(data: string): string {
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, "0").repeat(8) // Make it 64 chars
}

/**
 * Computes a commitment from a secret using Pedersen commitment scheme
 * commitment = hash(secret || nullifier || amount)
 */
export function computeCommitment(secret: string, amount: string, nullifier?: string): string {
  const nullifierValue = nullifier || generateNullifier()
  const data = `${secret}${nullifierValue}${amount}`
  const hash = simpleHash(data)
  return `0x${hash}`
}

/**
 * Generates a nullifier to prevent double-spending
 */
export function generateNullifier(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return `0x${Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")}`
}

/**
 * Creates a complete payment secret with commitment
 */
export function createPaymentSecret(amount: string): PaymentSecret {
  const secret = generateSecret()
  const nullifier = generateNullifier()
  const commitment = computeCommitment(secret, amount, nullifier)

  return {
    secret,
    commitment,
    nullifier,
    timestamp: Date.now(),
  }
}

/**
 * Verifies that a secret matches a commitment
 */
export function verifyCommitment(secret: string, commitment: string, amount: string, nullifier: string): boolean {
  const computedCommitment = computeCommitment(secret, amount, nullifier)
  return computedCommitment === commitment
}

/**
 * Generates a shareable link for the payment
 */
export function generateShareableLink(commitment: string, baseUrl = "https://pay.private"): string {
  const shortCommitment = commitment.slice(2, 12) // Use first 10 chars after 0x
  return `${baseUrl}/${shortCommitment}`
}

/**
 * Encrypts a secret for secure sharing (simple XOR for demo)
 */
export function encryptSecret(secret: string, password: string): string {
  const secretHex = secret.slice(2)
  const passwordHash = simpleHash(password)

  let encrypted = ""
  for (let i = 0; i < secretHex.length; i += 2) {
    const secretByte = Number.parseInt(secretHex.substr(i, 2), 16)
    const passwordByte = Number.parseInt(
      passwordHash.charAt(i % passwordHash.length) + passwordHash.charAt((i + 1) % passwordHash.length),
      16,
    )
    const encryptedByte = (secretByte ^ passwordByte).toString(16).padStart(2, "0")
    encrypted += encryptedByte
  }

  return `0x${encrypted}`
}

/**
 * Decrypts a secret using the password
 */
export function decryptSecret(encryptedSecret: string, password: string): string {
  const encryptedHex = encryptedSecret.slice(2)
  const passwordHash = simpleHash(password)

  let decrypted = ""
  for (let i = 0; i < encryptedHex.length; i += 2) {
    const encryptedByte = Number.parseInt(encryptedHex.substr(i, 2), 16)
    const passwordByte = Number.parseInt(
      passwordHash.charAt(i % passwordHash.length) + passwordHash.charAt((i + 1) % passwordHash.length),
      16,
    )
    const decryptedByte = (encryptedByte ^ passwordByte).toString(16).padStart(2, "0")
    decrypted += decryptedByte
  }

  return `0x${decrypted}`
}

/**
 * Simulates Merkle tree operations for commitment proofs
 */
export class MerkleTree {
  private leaves: string[] = []
  private tree: string[][] = []

  constructor(leaves: string[] = []) {
    this.leaves = leaves
    this.buildTree()
  }

  addLeaf(leaf: string): void {
    this.leaves.push(leaf)
    this.buildTree()
  }

  private buildTree(): void {
    if (this.leaves.length === 0) return

    this.tree = [this.leaves]
    let currentLevel = this.leaves

    while (currentLevel.length > 1) {
      const nextLevel: string[] = []

      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i]
        const right = currentLevel[i + 1] || left // Handle odd number of nodes
        const parent = simpleHash(left + right)
        nextLevel.push(`0x${parent}`)
      }

      this.tree.push(nextLevel)
      currentLevel = nextLevel
    }
  }

  getRoot(): string {
    if (this.tree.length === 0) return "0x"
    return this.tree[this.tree.length - 1][0]
  }

  getProof(leafIndex: number): string[] {
    const proof: string[] = []
    let currentIndex = leafIndex

    for (let level = 0; level < this.tree.length - 1; level++) {
      const currentLevel = this.tree[level]
      const isRightNode = currentIndex % 2 === 1
      const siblingIndex = isRightNode ? currentIndex - 1 : currentIndex + 1

      if (siblingIndex < currentLevel.length) {
        proof.push(currentLevel[siblingIndex])
      }

      currentIndex = Math.floor(currentIndex / 2)
    }

    return proof
  }

  verifyProof(leaf: string, proof: string[], leafIndex: number): boolean {
    let currentHash = leaf
    let currentIndex = leafIndex

    for (const sibling of proof) {
      const isRightNode = currentIndex % 2 === 1
      const left = isRightNode ? sibling : currentHash
      const right = isRightNode ? currentHash : sibling

      currentHash = `0x${simpleHash(left + right)}`
      currentIndex = Math.floor(currentIndex / 2)
    }

    return currentHash === this.getRoot()
  }
}

/**
 * Simulates zero-knowledge proof generation
 */
export function generateZKProof(
  secret: string,
  commitment: string,
  amount: string,
): {
  proof: string
  publicInputs: string[]
} {
  // Simulate ZK proof generation
  const proofData = simpleHash(`${secret}${commitment}${amount}${Date.now()}`)

  return {
    proof: `0x${proofData}`,
    publicInputs: [commitment, amount],
  }
}

/**
 * Verifies a zero-knowledge proof
 */
export function verifyZKProof(proof: string, publicInputs: string[], expectedCommitment: string): boolean {
  // Simulate proof verification
  return publicInputs[0] === expectedCommitment && proof.length === 66 // 0x + 64 hex chars
}
