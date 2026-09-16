import { describe, expect, it } from "vitest";
import { resume } from "../data/resume.js";
import { extractKeywords, tailorResume } from "./tailor.js";

describe("extractKeywords", () => {
  it("drops stopwords and short tokens", () => {
    const keywords = extractKeywords("We are looking for a React developer");
    expect(keywords.has("react")).toBe(true);
    expect(keywords.has("developer")).toBe(true);
    expect(keywords.has("for")).toBe(false);
    expect(keywords.has("a")).toBe(false);
  });
});

describe("tailorResume", () => {
  it("returns the resume unchanged when the job description is empty", () => {
    const { tailored, matchedKeywords } = tailorResume(resume, "");
    expect(tailored).toBe(resume);
    expect(matchedKeywords).toEqual([]);
  });

  it("moves the most relevant skill to the top and records original order", () => {
    const { tailored } = tailorResume(
      resume,
      "Looking for a PostgreSQL and MongoDB expert",
    );
    expect(tailored.skills[0].label).toMatch(/Databases/);
    expect(tailored.skillOrder[0]).toBe(3);
  });

  it("scores html bullets by their text content", () => {
    const html = {
      ...resume,
      workHistory: [
        {
          ...resume.workHistory[1],
          bullets: ["plain text", "<strong>Express</strong> apis"],
        },
      ],
    };
    const { tailored } = tailorResume(html, "Express APIs");
    expect(tailored.workHistory[0].bulletOrder).toEqual([1, 0]);
  });

  it("reports keywords that were found in the resume", () => {
    const { matchedKeywords } = tailorResume(
      resume,
      "Node.js and React experience",
    );
    expect(matchedKeywords).toEqual(
      expect.arrayContaining(["node.js", "react"]),
    );
  });
});
