import { useEffect, useState } from "react";

const FONTS = ["Questrial", "Inter", "Georgia", "Arial", "Times New Roman"];
/** execCommand fontSize takes 1–7; these map to px in sanitizeHtml. */
const SIZES = [
  ["1", "10"],
  ["2", "12"],
  ["3", "13"],
  ["4", "16"],
  ["5", "18"],
  ["6", "24"],
];

function editableAncestor(node) {
  let el = node?.nodeType === Node.TEXT_NODE ? node.parentElement : node;
  while (el && el !== document.body) {
    if (el.hasAttribute?.("data-editable")) return el;
    el = el.parentElement;
  }
  return null;
}

/**
 * A floating toolbar that appears above the current text selection inside
 * any editable field and applies inline formatting via execCommand.
 */
export function FormatToolbar() {
  const [pos, setPos] = useState(null);

  useEffect(() => {
    const update = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || !editableAncestor(sel.anchorNode)) {
        setPos(null);
        return;
      }
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      if (!rect.width && !rect.height && sel.isCollapsed) {
        // Caret in a field but nothing selected: anchor toolbar on the field.
        const host = editableAncestor(sel.anchorNode).getBoundingClientRect();
        setPos({
          top: host.top + window.scrollY - 44,
          left: host.left + window.scrollX,
        });
        return;
      }
      setPos({
        top: rect.top + window.scrollY - 44,
        left: rect.left + window.scrollX,
      });
    };
    document.addEventListener("selectionchange", update);
    window.addEventListener("scroll", update, true);
    return () => {
      document.removeEventListener("selectionchange", update);
      window.removeEventListener("scroll", update, true);
    };
  }, []);

  if (!pos) return null;

  const exec = (cmd, value) => {
    document.execCommand("styleWithCSS", false, false);
    document.execCommand(cmd, false, value);
  };
  // Keep the selection alive when clicking toolbar controls.
  const keepFocus = (e) => e.preventDefault();

  return (
    <div
      className="no-print fixed z-50 flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 text-sm shadow-lg"
      style={{ top: pos.top, left: pos.left, position: "absolute" }}
      onMouseDown={keepFocus}
      role="toolbar"
      aria-label="Text formatting"
    >
      <button
        type="button"
        className="tb-btn font-bold"
        onClick={() => exec("bold")}
        title="Bold"
      >
        B
      </button>
      <button
        type="button"
        className="tb-btn italic"
        onClick={() => exec("italic")}
        title="Italic"
      >
        I
      </button>
      <button
        type="button"
        className="tb-btn underline"
        onClick={() => exec("underline")}
        title="Underline"
      >
        U
      </button>
      <span className="mx-1 h-5 w-px bg-gray-200" />
      <select
        className="tb-select"
        defaultValue=""
        onChange={(e) => e.target.value && exec("fontName", e.target.value)}
        title="Font"
      >
        <option value="">Font</option>
        {FONTS.map((f) => (
          <option key={f} value={f} style={{ fontFamily: f }}>
            {f}
          </option>
        ))}
      </select>
      <select
        className="tb-select"
        defaultValue=""
        onChange={(e) => e.target.value && exec("fontSize", e.target.value)}
        title="Size"
      >
        <option value="">Size</option>
        {SIZES.map(([v, px]) => (
          <option key={v} value={v}>
            {px}px
          </option>
        ))}
      </select>
      <input
        type="color"
        className="h-7 w-7 cursor-pointer rounded border border-gray-200"
        onChange={(e) => exec("foreColor", e.target.value)}
        title="Text color"
      />
      <button
        type="button"
        className="tb-btn text-gray-500"
        onClick={() => exec("removeFormat")}
        title="Clear formatting"
      >
        ✕
      </button>
    </div>
  );
}
