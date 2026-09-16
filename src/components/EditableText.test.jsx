import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EditableText } from "./EditableText.jsx";

describe("EditableText", () => {
  it("renders html and commits sanitized content on blur", () => {
    const onChange = vi.fn();
    render(<EditableText html="Hello <b>world</b>" onChange={onChange} />);
    const el = screen.getByText("world").closest("[data-editable]");
    expect(el).toHaveAttribute("contenteditable", "true");

    el.innerHTML = "Edited <script>x()</script><i>text</i>";
    fireEvent.blur(el);
    expect(onChange).toHaveBeenCalledWith("Edited x()<i>text</i>");
  });

  it("does not call onChange when content is unchanged", () => {
    const onChange = vi.fn();
    render(<EditableText html="Same" onChange={onChange} />);
    fireEvent.blur(screen.getByText("Same"));
    expect(onChange).not.toHaveBeenCalled();
  });
});
