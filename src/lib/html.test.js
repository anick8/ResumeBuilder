import { describe, expect, it } from "vitest";
import { markdownBoldToHtml, sanitizeHtml, stripHtml } from "./html.js";

describe("sanitizeHtml", () => {
  it("keeps inline formatting tags", () => {
    expect(sanitizeHtml("<b>a</b> <i>b</i> <u>c</u> <strong>d</strong>")).toBe(
      "<b>a</b> <i>b</i> <u>c</u> <strong>d</strong>",
    );
  });

  it("strips scripts, event handlers and block tags", () => {
    expect(
      sanitizeHtml('<script>x()</script><div onclick="y()">hi</div>'),
    ).toBe("x() hi");
    expect(sanitizeHtml('<a href="http://x">link</a>')).toBe("link");
  });

  it("keeps only font-family, font-size and color styles", () => {
    expect(
      sanitizeHtml(
        '<span style="color: red; position: absolute; font-size: 12px">t</span>',
      ),
    ).toBe('<span style="color: red; font-size: 12px">t</span>');
  });

  it("converts execCommand <font> tags into styled spans", () => {
    expect(
      sanitizeHtml('<font face="Georgia" size="4" color="#ff0000">t</font>'),
    ).toBe(
      '<span style="font-family: Georgia; color: #ff0000; font-size: 16px">t</span>',
    );
  });

  it("unwraps spans with no allowed style", () => {
    expect(sanitizeHtml('<span class="x">t</span>')).toBe("t");
  });
});

describe("stripHtml", () => {
  it("returns plain text", () => {
    expect(stripHtml("Built <strong>Node.js</strong>  services")).toBe(
      "Built Node.js services",
    );
  });
});

describe("markdownBoldToHtml", () => {
  it("converts **bold** markers and escapes html", () => {
    expect(markdownBoldToHtml("a **b** <c>")).toBe(
      "a <strong>b</strong> &lt;c&gt;",
    );
  });
});
