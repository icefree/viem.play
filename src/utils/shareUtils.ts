/**
 * Share utilities for compressing and encoding canvas data in URLs
 * Uses CompressionStream API for gzip compression and Base64URL encoding
 */

/**
 * Compress a string using gzip and encode as Base64URL
 */
export async function compressToBase64(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const inputBytes = encoder.encode(data)
  
  // Use CompressionStream for gzip compression
  const cs = new CompressionStream('gzip')
  const writer = cs.writable.getWriter()
  writer.write(inputBytes)
  writer.close()
  
  // Read compressed bytes
  const reader = cs.readable.getReader()
  const chunks: Uint8Array[] = []
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }
  
  // Combine chunks
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
  const compressedBytes = new Uint8Array(totalLength)
  let offset = 0
  for (const chunk of chunks) {
    compressedBytes.set(chunk, offset)
    offset += chunk.length
  }
  
  // Convert to Base64URL (URL-safe Base64)
  let base64 = btoa(String.fromCharCode(...compressedBytes))
  // Make it URL-safe: replace + with -, / with _, and remove padding =
  base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  
  return base64
}

/**
 * Decompress a Base64URL string back to the original data
 */
export async function decompressFromBase64(base64url: string): Promise<string> {
  // Restore standard Base64 from Base64URL
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
  // Add padding if needed
  while (base64.length % 4 !== 0) {
    base64 += '='
  }
  
  // Convert Base64 to bytes
  const binaryString = atob(base64)
  const compressedBytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    compressedBytes[i] = binaryString.charCodeAt(i)
  }
  
  // Use DecompressionStream for gzip decompression
  const ds = new DecompressionStream('gzip')
  const writer = ds.writable.getWriter()
  writer.write(compressedBytes)
  writer.close()
  
  // Read decompressed bytes
  const reader = ds.readable.getReader()
  const chunks: Uint8Array[] = []
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }
  
  // Combine chunks
  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
  const decompressedBytes = new Uint8Array(totalLength)
  let offset = 0
  for (const chunk of chunks) {
    decompressedBytes.set(chunk, offset)
    offset += chunk.length
  }
  
  // Decode as UTF-8
  const decoder = new TextDecoder()
  return decoder.decode(decompressedBytes)
}

/**
 * Generate a shareable URL with the canvas data
 */
export async function generateShareUrl(graphData: object): Promise<string> {
  const jsonStr = JSON.stringify(graphData)
  const compressed = await compressToBase64(jsonStr)
  
  const url = new URL(window.location.href)
  // Clear any existing hash/params
  url.search = ''
  url.hash = ''
  
  // Use hash for data to avoid server-side issues and URL length limits on query params
  url.hash = `share=${compressed}`
  
  return url.toString()
}

/**
 * Parse share data from URL
 */
export async function parseShareUrl(): Promise<object | null> {
  const hash = window.location.hash
  if (!hash || !hash.startsWith('#share=')) {
    return null
  }
  
  try {
    const compressed = hash.slice(7) // Remove '#share='
    const jsonStr = await decompressFromBase64(compressed)
    return JSON.parse(jsonStr)
  } catch (err) {
    console.error('[ViemPlay] Failed to parse share URL:', err)
    return null
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('[ViemPlay] Failed to copy to clipboard:', err)
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return true
    } catch {
      return false
    }
  }
}

/**
 * Clear share data from URL without reloading
 */
export function clearShareUrl(): void {
  const url = new URL(window.location.href)
  url.hash = ''
  window.history.replaceState(null, '', url.toString())
}
