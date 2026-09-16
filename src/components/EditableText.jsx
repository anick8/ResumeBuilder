import { useEffect, useRef } from "react";
import { sanitizeHtml } from "../lib/html.js";

/**
 * An inline-editable rich-text field. Renders `html` inside a contentEditable
 * element and commits sanitized HTML on blur.
 * @param {{
 *   html: string,
 *   onChange: (html: string) => void,
 *   tag?: string,
 *   className?: string,
 *   multiline?: boolean,
 *   placeholder?: string,
 *   style?: object,
 * }} props
 */
export function EditableText({
  html,
  onChange,
  tag = "p",
  className = "",
  multiline = false,
  placeholder = "",
  style,
}) {
  const ref = useRef(null);
  const Tag = tag;

  // Sync external changes (e.g. reset or reorder) without clobbering focus.
  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.innerHTML !== html) {
      el.innerHTML = html;
    }
  }, [html]);

  const commit = () => {
    const el = ref.current;
    if (!el) return;
    const clean = sanitizeHtml(el.innerHTML);
    if (clean !== html) onChange(clean);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault();
      e.currentTarget.blur();
    }
    if (e.key === "Escape") e.currentTarget.blur();
  };

  const onPaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  };

  return (
    <Tag
      ref={ref}
      data-editable=""
      data-placeholder={placeholder}
      contentEditable
      suppressContentEditableWarning
      className={`editable ${className}`}
      style={style}
      onBlur={commit}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
