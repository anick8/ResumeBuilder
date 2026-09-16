import { MainColumn } from "./MainColumn.jsx";
import { ModernTemplate } from "./ModernTemplate.jsx";
import { Sidebar } from "./Sidebar.jsx";

/**
 * Renders the selected resume template on an A4 page.
 * - `sidebar`: navy left sidebar + main column (main column first in DOM).
 * - `modern`: full-width header + wide/narrow two-column body.
 * @param {{ resume: object, hidden?: string[], template?: string }} props
 */
export function ResumeTemplate({ resume, hidden = [], template = "sidebar" }) {
  return (
    <div className="resume-page mx-auto flex min-h-[297mm] w-[210mm] bg-white shadow-xl">
      {template === "modern" ? (
        <ModernTemplate resume={resume} hidden={hidden} />
      ) : (
        <>
          <MainColumn resume={resume} hidden={hidden} />
          <Sidebar resume={resume} hidden={hidden} />
        </>
      )}
    </div>
  );
}
