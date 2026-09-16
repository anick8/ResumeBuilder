/**
 * Textarea for pasting a job description, used to reorder resume content
 * by relevance. Shows which keywords were found in the resume.
 * @param {{
 *   value: string,
 *   onChange: (text: string) => void,
 *   matchedKeywords: string[],
 * }} props
 */
export function JobDescriptionInput({ value, onChange, matchedKeywords }) {
  return (
    <div>
      <label htmlFor="job-description" className="block text-sm font-medium">
        Job description
      </label>
      <textarea
        id="job-description"
        className="mt-1 h-40 w-full rounded border border-gray-300 p-2 text-sm"
        placeholder="Paste the job description here to tailor skill and bullet order…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {matchedKeywords.length > 0 && (
        <p className="mt-2 text-xs text-gray-500">
          Matched keywords: {matchedKeywords.join(', ')}
        </p>
      )}
    </div>
  )
}
