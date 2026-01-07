
interface StyleSelectorProps {
  value: string
  onChange: (style: string) => void
  disabled: boolean
}

const STYLES = ["Realistic", "Cartoon", "Anime", "3D"]

export default function StyleSelector({ value, onChange, disabled }: StyleSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-white mb-3">Style</label>
      <div className="grid grid-cols-2 gap-2">
        {STYLES.map((style) => (
          <button
            key={style}
            onClick={() => onChange(style)}
            disabled={disabled}
            className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
              value === style
                ? "bg-blue-600 text-white border border-blue-500"
                : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  )
}
