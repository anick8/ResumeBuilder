import { stripHtml } from "./html.js";

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "you",
  "your",
  "are",
  "this",
  "that",
  "will",
  "have",
  "from",
  "our",
  "a",
  "an",
  "to",
  "of",
  "in",
  "on",
  "is",
  "as",
  "we",
  "be",
  "or",
  "at",
  "by",
  "it",
  "can",
  "their",
  "who",
  "all",
  "work",
  "team",
]);

/**
 * Extracts meaningful keywords (length > 2, not a stopword) from free text.
 * @param {string} text
 * @returns {Set<string>} lowercased unique keywords
 */
export function extractKeywords(text) {
  const words = (text.toLowerCase().match(/[a-z0-9+.#]+/g) || []).filter(
    (w) => w.length > 2 && !STOPWORDS.has(w),
  );
  return new Set(words);
}

/**
 * Counts JD keywords that appear in a piece of resume text (HTML allowed).
 * @param {string} text
 * @param {Set<string>} keywords
 * @returns {number}
 */
function scoreText(text, keywords) {
  const lower = stripHtml(text).toLowerCase();
  let score = 0;
  for (const kw of keywords) {
    if (lower.includes(kw)) score += 1;
  }
  return score;
}

/**
 * Returns indices of `items` sorted by descending score (stable).
 * @param {string[]} items
 * @param {Set<string>} keywords
 * @returns {number[]}
 */
function rankedOrder(items, keywords) {
  return items
    .map((text, i) => ({ i, score: scoreText(text, keywords) }))
    .sort((a, b) => b.score - a.score)
    .map(({ i }) => i);
}

/**
 * Tailors the resume to a job description by reordering skills and work
 * bullets so the most relevant come first. Never invents content. The
 * returned view carries `skillOrder` and per-job `bulletOrder` (original
 * indices) so in-place edits can be written back to the source data.
 * @param {object} resume
 * @param {string} jobDescription
 * @returns {{tailored: object, matchedKeywords: string[]}}
 */
export function tailorResume(resume, jobDescription) {
  const keywords = extractKeywords(jobDescription || "");

  if (keywords.size === 0) {
    return { tailored: resume, matchedKeywords: [] };
  }

  const skillOrder = rankedOrder(
    resume.skills.map((s) => s.label),
    keywords,
  );
  const skills = skillOrder.map((i) => resume.skills[i]);

  const workHistory = resume.workHistory.map((job) => {
    const bulletOrder = rankedOrder(job.bullets, keywords);
    return {
      ...job,
      bulletOrder,
      bullets: bulletOrder.map((i) => job.bullets[i]),
    };
  });

  const corpus = stripHtml(
    [
      resume.summary,
      ...resume.skills.map((s) => s.label),
      ...resume.workHistory.flatMap((j) => j.bullets),
    ].join(" "),
  ).toLowerCase();
  const matchedKeywords = [...keywords].filter((kw) => corpus.includes(kw));

  return {
    tailored: { ...resume, skills, skillOrder, workHistory },
    matchedKeywords,
  };
}
