/**
 * Triggers the browser's native print dialog, which the user can save as a
 * PDF. Deliberately not using a canvas-rasterizing library (e.g. html2pdf):
 * this keeps the exported PDF's text real and selectable, which ATS parsers
 * require. Layout for print is handled by the `@media print` rules in
 * src/index.css.
 */
export function exportPdf() {
  window.print()
}
