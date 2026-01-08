interface AspectRatioSelectorProps {
  value: string
  onChange: (ratio: string) => void
  disabled: boolean
}

const ASPECT_RATIOS = ["1:1", "16:9"]

export default function AspectRatioSelector({ value, onChange, disabled }: AspectRatioSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-white mb-3">Aspect Ratio</label>
      <div className="grid grid-cols-3 gap-2">
        {ASPECT_RATIOS.map((ratio) => (
          <button
            key={ratio}
            onClick={() => onChange(ratio)}
            disabled={disabled}
            className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
              value === ratio
                ? "bg-cyan-600 text-white border border-cyan-500"
                : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {ratio}
          </button>
        ))}
      </div>
    </div>
  )
}
