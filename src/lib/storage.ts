import type { GeneratedImage } from "./types"

const STORAGE_KEY = "ai-image-generator-history"
const MAX_HISTORY = 5

export function saveToStorage(images: GeneratedImage[]): void {
  try {
    const limitedHistory = images.slice(0, MAX_HISTORY)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory))
  } catch (error) {
    console.error("Failed to save to localStorage:", error)
  }
}

export function getHistoryFromStorage(): GeneratedImage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error("Failed to read from localStorage:", error)
    return []
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error("Failed to clear localStorage:", error)
  }
}
