import { useState, useEffect } from "react"
import type { GeneratedImage } from "../lib/types"
import { Loader2, Sparkles } from "lucide-react"
import { getHistoryFromStorage, saveToStorage } from "../lib/storage"
import { generateImageWithAI } from "../lib/api"
import StyleSelector from "./StyleSelector"
import AspectRatioSelector from "./AspectRatioSelector"
import ImagePreview from "./ImagePreview"
import ImageHistory from "./ImageHistory"


export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("Realistic")
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null)
  const [history, setHistory] = useState<GeneratedImage[]>([])

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = getHistoryFromStorage()
    setHistory(savedHistory)
  }, [])

  // Save to history whenever current image changes
  useEffect(() => {
    if (currentImage) {
      const updatedHistory = [currentImage, ...history].slice(0, 5)
      setHistory(updatedHistory)
      saveToStorage(updatedHistory)
    }
  }, [currentImage])

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt")
      return
    }

    setLoading(true)
    setError("")

    try {
      const enhancedPrompt = `${prompt} in ${style} style, ${aspectRatio} aspect ratio`
      const imageUrl = await generateImageWithAI(enhancedPrompt)

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt,
        enhancedPrompt,
        style,
        aspectRatio,
        imageUrl,
        createdAt: new Date().toISOString(),
      }

      setCurrentImage(newImage)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate image.")
    } finally {
      setLoading(false)
    }
  }

  const handleRegenerateImage = () => {
    if (currentImage) {
      setPrompt(currentImage.prompt)
      setStyle(currentImage.style)
      setAspectRatio(currentImage.aspectRatio)
      handleGenerateImage()
    }
  }

  const handleClearImage = () => {
    setCurrentImage(null)
    setPrompt("")
    setError("")
  }

  const handleSelectFromHistory = (image: GeneratedImage) => {
    setCurrentImage(image)
    setPrompt(image.prompt)
    setStyle(image.style)
    setAspectRatio(image.aspectRatio)
  }

  return (
    <div className="space-y-8">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Input Panel - Left Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-6 space-y-6 sticky top-24">
            {/* Title */}
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Generate Image</h2>

            {/* Prompt Textarea */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Image Description *
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate... (e.g., 'A serene mountain landscape with golden sunset')"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
                disabled={loading}
              />
            </div>

            {/* Style Selector */}
            <StyleSelector value={style} onChange={setStyle} disabled={loading} />

            {/* Aspect Ratio Selector */}
            <AspectRatioSelector value={aspectRatio} onChange={setAspectRatio} disabled={loading} />

            {/* Generate Button */}
            <button
              onClick={handleGenerateImage}
              disabled={loading || !prompt.trim()}
              className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Image
                </>
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel - Right Side */}
        <div className="lg:col-span-2">
          {currentImage ? (
            <ImagePreview
              image={currentImage}
              onRegenerate={handleRegenerateImage}
              onClear={handleClearImage}
              loading={loading}
            />
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-12 flex flex-col items-center justify-center min-h-96 lg:min-h-full">
              <div className="text-gray-500 dark:text-slate-400 text-center space-y-4">
                <Sparkles size={48} className="mx-auto opacity-50" />
                <p className="text-lg font-semibold text-gray-700 dark:text-slate-300">No image generated yet</p>
                <p className="text-sm text-gray-600 dark:text-slate-500">
                  Enter a prompt and click "Generate Image" to create your first AI image
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Generation History</h2>
            <span className="text-sm text-gray-600 dark:text-slate-400">Last {history.length} images</span>
          </div>
          <ImageHistory history={history} onSelectImage={handleSelectFromHistory} />
        </div>
      )}
    </div>
  )
}
