/**
 * Lets the user change the resume's single accent color. This is the only
 * customization the fixed template allows.
 * @param {{ accent: string, onChange: (color: string) => void }} props
 */
export function ColorPicker({ accent, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="accent-color" className="text-sm font-medium">
        Accent color
      </label>
      <input
        id="accent-color"
        type="color"
        value={accent}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded border border-gray-300"
      />
    </div>
  )
}
