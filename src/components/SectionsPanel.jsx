import { useResume } from "../hooks/useResume.jsx";

export const SECTIONS = [
  { id: "summary", label: "Summary" },
  { id: "workHistory", label: "Work History" },
  { id: "education", label: "Education" },
  { id: "accomplishments", label: "Accomplishments" },
  { id: "references", label: "References" },
  { id: "skills", label: "Skills" },
  { id: "languages", label: "Languages (Modern only)" },
];

/** Lists resume sections with show/hide toggles and click-to-scroll. */
export function SectionsPanel() {
  const { design, toggleSection } = useResume();
  const hidden = design.hiddenSections || [];

  return (
    <ul className="space-y-1">
      {SECTIONS.map((s) => {
        const isHidden = hidden.includes(s.id);
        return (
          <li
            key={s.id}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <button
              type="button"
              className={`text-left hover:underline ${isHidden ? "text-gray-400 line-through" : ""}`}
              onClick={() =>
                document
                  .getElementById(`section-${s.id}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              {s.label}
            </button>
            <label className="flex items-center gap-1 text-xs text-gray-500">
              <input
                type="checkbox"
                checked={!isHidden}
                onChange={() => toggleSection(s.id)}
              />
              show
            </label>
          </li>
        );
      })}
    </ul>
  );
}
