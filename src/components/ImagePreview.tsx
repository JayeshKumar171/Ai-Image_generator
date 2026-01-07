import type { GeneratedImage } from "../lib/types"
import { Download, RotateCw, Trash2, Copy, Check } from "lucide-react"
import { useState } from "react"

interface ImagePreviewProps {
  image: GeneratedImage
  onRegenerate: () => void
  onClear: () => void
  loading: boolean
}

export default function ImagePreview({ image, onRegenerate, onClear, loading }: ImagePreviewProps) {
  const [copied, setCopied] = useState(false)

  const handleDownload = async () => {
    try {
      const response = await fetch(image.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `ai-image-${image.id}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to download image:", error)
    }
  }

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(image.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Image Container */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
        <div className="relative bg-slate-950 aspect-square w-full">
          <img 
            src={image.imageUrl} 
            alt={image.prompt} 
            className="w-full h-full object-cover" 
          />
          
          {/* Download button */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleDownload}
              className="p-3 rounded-full bg-black/70 hover:bg-black text-white transition-all duration-200 
                       shadow-lg hover:shadow-xl hover:scale-110 active:scale-105 backdrop-blur-sm"
              title="Download image"
            >
              <Download size={20} />
            </button>
            <button
              onClick={handleCopyPrompt}
              className={`p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110 active:scale-105 backdrop-blur-sm ${
                copied 
                  ? "bg-green-600 text-white" 
                  : "bg-black/70 hover:bg-black text-white"
              }`}
              title={copied ? "Copied!" : "Copy prompt"}
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Prompt</label>
          <p className="text-sm text-slate-300 leading-relaxed break-words">{image.prompt}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Style</label>
            <div className="inline-block px-3 py-1 rounded-full bg-blue-900/30 border border-blue-700/50 text-xs font-medium text-blue-300">
              {image.style}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
              Aspect Ratio
            </label>
            <div className="inline-block px-3 py-1 rounded-full bg-cyan-900/30 border border-cyan-700/50 text-xs font-medium text-cyan-300">
              {image.aspectRatio}
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500">Created: {new Date(image.createdAt).toLocaleString()}</div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onRegenerate}
          disabled={loading}
          className="flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCw size={18} className={loading ? "animate-spin" : ""} />
          {loading ? "Regenerating..." : "Regenerate"}
        </button>
        <button
          onClick={onClear}
          className="flex-1 px-4 py-2 rounded-lg bg-red-900/20 hover:bg-red-900/30 text-red-300 font-medium transition-colors flex items-center justify-center gap-2 border border-red-700/30"
        >
          <Trash2 size={18} />
          Clear
        </button>
      </div>

      {copied && (
        <div className="px-4 py-2 rounded-lg bg-green-900/20 border border-green-700/50 text-green-300 text-sm text-center animate-in fade-in slide-in-from-top-2 duration-300">
          ✅ Prompt copied to clipboard!
        </div>
      )}
    </div>
  )
}