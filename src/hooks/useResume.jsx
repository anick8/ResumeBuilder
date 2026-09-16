import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { resume as seedResume } from "../data/resume.js";
import { markdownBoldToHtml } from "../lib/html.js";
import { getIn, setIn, updateIn } from "../lib/paths.js";

const STORAGE_KEY = "resumebuilder:v1";
export const DEFAULT_ACCENT = "#0f2a6e";
export const DEFAULT_TEMPLATE = "sidebar";
export const TEMPLATES = [
  { id: "sidebar", label: "Sidebar", hint: "Navy sidebar, two columns" },
  { id: "modern", label: "Modern", hint: "Header + two columns, skill chips" },
];

/** Seed state: bullets in resume.js use **bold** markers, converted to HTML once. */
function seedState() {
  return {
    resume: {
      ...seedResume,
      workHistory: seedResume.workHistory.map((job) => ({
        ...job,
        bullets: job.bullets.map(markdownBoldToHtml),
      })),
    },
    design: {
      accent: DEFAULT_ACCENT,
      hiddenSections: [],
      template: DEFAULT_TEMPLATE,
    },
  };
}

/** Fills in fields added after a user's state was first saved. */
function migrate(parsed) {
  const seed = seedState();
  // Backfill per-job fields (location/description) from the seed job with the same role.
  const workHistory = (
    parsed.resume.workHistory || seed.resume.workHistory
  ).map((job) => {
    const match = seed.resume.workHistory.find((s) => s.role === job.role);
    return match
      ? { location: match.location, description: match.description, ...job }
      : job;
  });
  return {
    resume: {
      ...seed.resume,
      ...parsed.resume,
      contact: { ...seed.resume.contact, ...parsed.resume.contact },
      workHistory,
    },
    design: { ...seed.design, ...parsed.design },
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed?.resume && parsed?.design) return migrate(parsed);
    }
  } catch {
    // Ignore corrupt or unavailable storage and fall back to the seed.
  }
  return seedState();
}

function moveInArray(list, from, to) {
  if (to < 0 || to >= list.length) return list;
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

/**
 * @param {{resume: object, design: object}} state
 * @param {{type: string, [key: string]: *}} action
 */
export function resumeReducer(state, action) {
  switch (action.type) {
    case "setField":
      return setIn(state, ["resume", ...action.path], action.value);
    case "addItem":
      return updateIn(state, ["resume", ...action.path], (list) => [
        ...(list || []),
        action.item,
      ]);
    case "removeItem":
      return updateIn(state, ["resume", ...action.path], (list) =>
        list.filter((_, i) => i !== action.index),
      );
    case "moveItem":
      return updateIn(state, ["resume", ...action.path], (list) =>
        moveInArray(list, action.from, action.to),
      );
    case "setAccent":
      return setIn(state, ["design", "accent"], action.color);
    case "setTemplate":
      return setIn(state, ["design", "template"], action.template);
    case "toggleSection": {
      const hidden = state.design.hiddenSections || [];
      const next = hidden.includes(action.section)
        ? hidden.filter((s) => s !== action.section)
        : [...hidden, action.section];
      return setIn(state, ["design", "hiddenSections"], next);
    }
    case "reset":
      return seedState();
    default:
      return state;
  }
}

const ResumeContext = createContext(null);

/**
 * Holds the editable resume and design settings, persisted to localStorage.
 * @param {{ children: import('react').ReactNode }} props
 */
export function ResumeProvider({ children }) {
  const [state, dispatch] = useReducer(resumeReducer, undefined, loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage may be full or blocked; edits stay in memory.
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", state.design.accent);
  }, [state.design.accent]);

  const api = useMemo(
    () => ({
      resume: state.resume,
      design: state.design,
      getField: (path) => getIn(state.resume, path),
      setField: (path, value) => dispatch({ type: "setField", path, value }),
      addItem: (path, item) => dispatch({ type: "addItem", path, item }),
      removeItem: (path, index) =>
        dispatch({ type: "removeItem", path, index }),
      moveItem: (path, from, to) =>
        dispatch({ type: "moveItem", path, from, to }),
      setAccent: (color) => dispatch({ type: "setAccent", color }),
      setTemplate: (template) => dispatch({ type: "setTemplate", template }),
      toggleSection: (section) => dispatch({ type: "toggleSection", section }),
      reset: () => dispatch({ type: "reset" }),
    }),
    [state],
  );

  return (
    <ResumeContext.Provider value={api}>{children}</ResumeContext.Provider>
  );
}

/** @returns {ReturnType<typeof ResumeProvider> extends never ? never : object} */
export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used inside <ResumeProvider>");
  return ctx;
}

export { seedState, STORAGE_KEY };
