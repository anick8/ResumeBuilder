import { useMemo, useState } from "react";
import { tailorResume } from "../lib/tailor.js";
import { useResume } from "./useResume.jsx";

/**
 * Manages the job-description input and derives a read-only view of the
 * editable resume with skills and bullets reordered by relevance.
 * @returns {{
 *   jobDescription: string,
 *   setJobDescription: (text: string) => void,
 *   tailored: object,
 *   matchedKeywords: string[],
 * }}
 */
export function useTailoredResume() {
  const { resume } = useResume();
  const [jobDescription, setJobDescription] = useState("");

  const { tailored, matchedKeywords } = useMemo(
    () => tailorResume(resume, jobDescription),
    [resume, jobDescription],
  );

  return { jobDescription, setJobDescription, tailored, matchedKeywords };
}
