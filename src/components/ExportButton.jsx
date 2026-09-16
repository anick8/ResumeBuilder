import { exportPdf } from "../lib/exportPdf.js";

/** Triggers the browser print dialog so the user can save the resume as a PDF. */
export function ExportButton() {
  return (
    <button
      type="button"
      onClick={exportPdf}
      className="rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90"
      style={{ backgroundColor: "var(--accent)" }}
    >
      Export as PDF
    </button>
  );
}
