interface Props {
  value: string
  onChange: (val: string) => void
  onSubmit: () => void
  loading: boolean
}

export default function TextPrompt({
  value,
  onChange,
  onSubmit,
  loading,
}: Props) {
  const isDisabled = loading || value.trim() === ""

  return (
    <div className="flex gap-2 items-center">
      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter prompt (e.g. 'dog', 'car wheel')"
        className="border rounded px-3 py-2 flex-1"
      />

      {/* Button */}
      <button
        onClick={onSubmit}
        disabled={isDisabled}
        className="px-4 py-2 rounded bg-blue-600 text-white disabled:bg-gray-400"
      >
        {loading ? "Segmenting..." : "Segment"}
      </button>
    </div>
  )
}

