interface Props {
  value: string
  onChange: (val: string) => void
  onSubmit: () => void
  loading: boolean
  threshold: number
  onThresholdChange: (val: number) => void
}

export default function TextPrompt({
  value,
  onChange,
  onSubmit,
  loading,
  threshold,
  onThresholdChange,
}: Props) {
  const isDisabled = loading || value.trim() === ""

  return (
    <div className="flex flex-col gap-4">
      {/* Prompt + Button */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter prompt (e.g. 'dog', 'car wheel')"
          className="border rounded px-3 py-2 flex-1"
        />

        <button
          onClick={onSubmit}
          disabled={isDisabled}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-400"
        >
          {loading ? "Segmenting..." : "Segment"}
        </button>
      </div>

      {/* 🔥 Threshold Slider */}
      <div className="flex flex-col gap-2">
        <label className="font-medium">
          Threshold: {threshold.toFixed(2)}
        </label>

        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={threshold}
          onChange={(e) => onThresholdChange(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  )
}
