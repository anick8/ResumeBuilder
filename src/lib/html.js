const ALLOWED_TAGS = new Set(["B", "STRONG", "I", "EM", "U", "SPAN", "BR"]);
const ALLOWED_STYLES = new Set(["font-family", "font-size", "color"]);

/** Maps legacy <font size="1..7"> values (from execCommand) to pixel sizes. */
const FONT_SIZE_MAP = {
  1: "10px",
  2: "12px",
  3: "13px",
  4: "16px",
  5: "18px",
  6: "24px",
  7: "32px",
};

/**
 * Keeps only the allowed inline style declarations from a style string.
 * @param {string} style
 * @returns {string}
 */
function filterStyle(style) {
  return style
    .split(";")
    .map((decl) => decl.trim())
    .filter((decl) => {
      const name = decl.split(":")[0]?.trim().toLowerCase();
      return name && ALLOWED_STYLES.has(name);
    })
    .join("; ");
}

/**
 * Recursively sanitizes a DOM node in place, unwrapping disallowed elements
 * and converting <font> tags (produced by execCommand) into styled spans.
 * @param {Node} node
 * @param {Document} doc
 */
function cleanNode(node, doc) {
  for (const child of [...node.childNodes]) {
    if (child.nodeType === Node.TEXT_NODE) continue;
    if (child.nodeType !== Node.ELEMENT_NODE) {
      child.remove();
      continue;
    }

    let el = child;
    if (el.tagName === "FONT") {
      const span = doc.createElement("span");
      const styles = [];
      if (el.getAttribute("face"))
        styles.push(`font-family: ${el.getAttribute("face")}`);
      if (el.getAttribute("color"))
        styles.push(`color: ${el.getAttribute("color")}`);
      const size = FONT_SIZE_MAP[el.getAttribute("size")];
      if (size) styles.push(`font-size: ${size}`);
      if (styles.length) span.setAttribute("style", styles.join("; "));
      while (el.firstChild) span.appendChild(el.firstChild);
      el.replaceWith(span);
      el = span;
    }

    if (!ALLOWED_TAGS.has(el.tagName)) {
      // Unwrap: keep children, drop the element (block tags become spaces).
      const isBlock = /^(DIV|P|LI|UL|OL|H\d)$/.test(el.tagName);
      if (isBlock && el.previousSibling) el.before(doc.createTextNode(" "));
      cleanNode(el, doc);
      while (el.firstChild) el.before(el.firstChild);
      el.remove();
      continue;
    }

    for (const attr of [...el.attributes]) {
      if (attr.name === "style") {
        const filtered = filterStyle(attr.value);
        if (filtered) el.setAttribute("style", filtered);
        else el.removeAttribute("style");
      } else {
        el.removeAttribute(attr.name);
      }
    }
    if (el.tagName === "SPAN" && !el.getAttribute("style")) {
      cleanNode(el, doc);
      while (el.firstChild) el.before(el.firstChild);
      el.remove();
      continue;
    }
    cleanNode(el, doc);
  }
}

/**
 * Sanitizes user-edited HTML down to inline formatting only.
 * @param {string} html
 * @returns {string}
 */
export function sanitizeHtml(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(
    `<body>${html}</body>`,
    "text/html",
  );
  cleanNode(doc.body, doc);
  return doc.body.innerHTML.replace(/&nbsp;/g, " ").trim();
}

/**
 * Returns the plain text of an HTML string.
 * @param {string} html
 * @returns {string}
 */
export function stripHtml(html) {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent || "").replace(/\s+/g, " ").trim();
}

/**
 * Converts `**bold**` markers into <strong> tags, escaping everything else.
 * @param {string} text
 * @returns {string}
 */
export function markdownBoldToHtml(text) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}
