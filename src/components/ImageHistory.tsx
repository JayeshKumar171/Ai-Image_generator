import type { GeneratedImage } from "../lib/types"

interface ImageHistoryProps {
  history: GeneratedImage[]
  onSelectImage: (image: GeneratedImage) => void
}

export default function ImageHistory({ history, onSelectImage }: ImageHistoryProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
      {history.map((image) => (
        <button
          key={image.id}
          onClick={() => onSelectImage(image)}
          className="group relative aspect-square rounded-lg overflow-hidden border border-slate-700 hover:border-blue-500 transition-colors"
          title={image.prompt}
        >
          <img
            src={image.imageUrl || "/placeholder.svg"}
            alt={image.prompt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <span className="text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 px-2 py-1 rounded">
              {image.style}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
