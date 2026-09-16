import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  ResumeProvider,
  resumeReducer,
  seedState,
  STORAGE_KEY,
  useResume,
} from "./useResume.jsx";

describe("resumeReducer", () => {
  const state = seedState();

  it("converts seed bullets from **bold** to <strong>", () => {
    expect(state.resume.workHistory[0].bullets[0]).toContain("<strong>");
  });

  it("setField updates a nested field", () => {
    const next = resumeReducer(state, {
      type: "setField",
      path: ["name"],
      value: "Jane",
    });
    expect(next.resume.name).toBe("Jane");
    expect(state.resume.name).not.toBe("Jane");
  });

  it("addItem / removeItem / moveItem manage lists", () => {
    let s = resumeReducer(state, {
      type: "addItem",
      path: ["references"],
      item: { name: "R" },
    });
    expect(s.resume.references).toHaveLength(
      state.resume.references.length + 1,
    );
    s = resumeReducer(s, {
      type: "moveItem",
      path: ["references"],
      from: 3,
      to: 0,
    });
    expect(s.resume.references[0].name).toBe("R");
    s = resumeReducer(s, {
      type: "removeItem",
      path: ["references"],
      index: 0,
    });
    expect(s.resume.references).toHaveLength(state.resume.references.length);
  });

  it("setTemplate switches the template", () => {
    const s = resumeReducer(state, { type: "setTemplate", template: "modern" });
    expect(s.design.template).toBe("modern");
    expect(state.design.template).toBe("sidebar");
  });

  it("toggleSection hides and shows a section", () => {
    let s = resumeReducer(state, {
      type: "toggleSection",
      section: "references",
    });
    expect(s.design.hiddenSections).toEqual(["references"]);
    s = resumeReducer(s, { type: "toggleSection", section: "references" });
    expect(s.design.hiddenSections).toEqual([]);
  });
});

describe("ResumeProvider", () => {
  beforeEach(() => localStorage.clear());

  it("migrates older saved state by filling in new fields", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        resume: {
          name: "Old",
          contact: { email: "e" },
          workHistory: [
            {
              role: "Backend Developer",
              company: "Hashx",
              dates: "x",
              bullets: [],
            },
          ],
        },
        design: { accent: "#123456" },
      }),
    );
    const wrapper = ({ children }) => (
      <ResumeProvider>{children}</ResumeProvider>
    );
    const { result } = renderHook(() => useResume(), { wrapper });
    expect(result.current.resume.name).toBe("Old");
    expect(result.current.resume.tags.length).toBeGreaterThan(0);
    expect(result.current.resume.contact.linkedin).toContain("linkedin");
    expect(result.current.design.template).toBe("sidebar");
    expect(result.current.resume.workHistory[0].location).toBe("Bengaluru");
    expect(result.current.design.accent).toBe("#123456");
  });

  it("persists changes to localStorage and restores them", () => {
    const wrapper = ({ children }) => (
      <ResumeProvider>{children}</ResumeProvider>
    );
    const { result } = renderHook(() => useResume(), { wrapper });
    act(() => result.current.setField(["title"], "Staff Engineer"));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).resume.title).toBe(
      "Staff Engineer",
    );

    const second = renderHook(() => useResume(), { wrapper });
    expect(second.result.current.resume.title).toBe("Staff Engineer");

    act(() => second.result.current.reset());
    expect(second.result.current.resume.title).toBe("Software Engineer");
  });
});
