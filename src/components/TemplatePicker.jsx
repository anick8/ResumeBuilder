import { TEMPLATES } from "../hooks/useResume.jsx";

/** Small preview glyph for a template option. */
function Thumb({ id }) {
  const accent = "var(--accent)";
  if (id === "sidebar") {
    return (
      <div className="thumb">
        <div style={{ background: accent, width: "30%" }} />
        <div className="thumb-lines" />
      </div>
    );
  }
  return (
    <div className="thumb thumb-col">
      <div style={{ background: accent, height: 8, width: "55%", margin: 6 }} />
      <div className="thumb-lines thumb-two" />
    </div>
  );
}

/**
 * Lets the user switch between the available resume templates.
 * @param {{ value: string, onChange: (id: string) => void }} props
 */
export function TemplatePicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {TEMPLATES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          aria-pressed={value === t.id}
          className={`rounded-lg border p-2 text-left text-xs transition ${
            value === t.id
              ? "border-blue-500 ring-2 ring-blue-200"
              : "border-gray-200 hover:border-gray-400"
          }`}
        >
          <Thumb id={t.id} />
          <div className="mt-1.5 font-semibold text-gray-800">{t.label}</div>
          <div className="text-[11px] text-gray-500">{t.hint}</div>
        </button>
      ))}
    </div>
  );
}
