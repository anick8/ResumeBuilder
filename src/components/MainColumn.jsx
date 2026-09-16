import { useResume } from "../hooks/useResume.jsx";
import { EditableText } from "./EditableText.jsx";
import { AddButton, ItemControls } from "./ListControls.jsx";

/** @param {{ children: import('react').ReactNode }} props */
function SectionHeading({ children }) {
  return (
    <h2 className="section-heading" style={{ color: "var(--accent)" }}>
      {children}
      <span
        className="section-rule"
        style={{ backgroundColor: "var(--accent)" }}
      />
    </h2>
  );
}

/**
 * Left date column + right content, used for jobs and education.
 * @param {{ dates: string, onDates: (v: string) => void, children: import('react').ReactNode }} props
 */
function DatedEntry({ dates, onDates, children }) {
  return (
    <div className="grid grid-cols-[92px_1fr] gap-x-5">
      <EditableText html={dates} onChange={onDates} className="date-col" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

const NEW_JOB = {
  role: "Job Title",
  company: "Company, City",
  dates: "2024-01 - Current",
  bullets: ["Describe what you achieved here."],
};
const NEW_EDU = {
  degree: "Degree",
  school: "School - City",
  dates: "2010-07 - 2014-07",
};
const NEW_REF = {
  name: "Name - Title",
  company: "Company, City",
  contact: "phone, email",
};

/**
 * Summary, work history, education, accomplishments and references. Rendered
 * before the sidebar in DOM order for ATS-friendly text extraction.
 * @param {{ resume: object, hidden: string[] }} props
 */
export function MainColumn({ resume, hidden }) {
  const { setField, addItem, removeItem, moveItem } = useResume();
  const show = (id) => !hidden.includes(id);

  const listItem = (path, i, len, extra = {}) => (
    <ItemControls
      onRemove={() => removeItem(path, i)}
      onUp={i > 0 ? () => moveItem(path, i, i - 1) : undefined}
      onDown={i < len - 1 ? () => moveItem(path, i, i + 1) : undefined}
      {...extra}
    />
  );

  return (
    <div className="main-col min-w-0 flex-1 space-y-7 px-9 py-9">
      {show("summary") && (
        <section id="section-summary">
          <EditableText
            multiline
            html={resume.summary}
            onChange={(v) => setField(["summary"], v)}
            className="text-[13px] leading-[1.65] text-gray-700"
          />
        </section>
      )}

      {show("workHistory") && (
        <section id="section-workHistory" className="space-y-5">
          <SectionHeading>Work History</SectionHeading>
          {resume.workHistory.map((job, j) => {
            // bullets may be JD-reordered; write back via original index map
            const order = job.bulletOrder || job.bullets.map((_, i) => i);
            return (
              <div key={j} className="group/item relative">
                <DatedEntry
                  dates={job.dates}
                  onDates={(v) => setField(["workHistory", j, "dates"], v)}
                >
                  <EditableText
                    html={job.role}
                    onChange={(v) => setField(["workHistory", j, "role"], v)}
                    className="text-[14.5px] font-bold text-gray-900"
                  />
                  <EditableText
                    html={job.company}
                    onChange={(v) => setField(["workHistory", j, "company"], v)}
                    className="mt-0.5 text-[12.5px] italic text-gray-500"
                  />
                  <ul className="bullets mt-2 space-y-1.5">
                    {job.bullets.map((bullet, b) => {
                      const idx = order[b];
                      return (
                        <li key={idx} className="group/bullet relative">
                          <EditableText
                            tag="span"
                            multiline
                            html={bullet}
                            onChange={(v) =>
                              setField(["workHistory", j, "bullets", idx], v)
                            }
                            className="block"
                          />
                          {listItem(
                            ["workHistory", j, "bullets"],
                            idx,
                            job.bullets.length,
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  <AddButton
                    label="Add bullet"
                    onClick={() =>
                      addItem(["workHistory", j, "bullets"], "New achievement.")
                    }
                  />
                </DatedEntry>
                {listItem(["workHistory"], j, resume.workHistory.length)}
              </div>
            );
          })}
          <AddButton
            label="Add job"
            onClick={() => addItem(["workHistory"], NEW_JOB)}
          />
        </section>
      )}

      {show("education") && (
        <section id="section-education" className="space-y-4">
          <SectionHeading>Education</SectionHeading>
          {resume.education.map((edu, i) => (
            <div key={i} className="group/item relative">
              <DatedEntry
                dates={edu.dates}
                onDates={(v) => setField(["education", i, "dates"], v)}
              >
                <EditableText
                  html={edu.degree}
                  onChange={(v) => setField(["education", i, "degree"], v)}
                  className="text-[14.5px] font-bold text-gray-900"
                />
                <EditableText
                  html={edu.school}
                  onChange={(v) => setField(["education", i, "school"], v)}
                  className="mt-0.5 text-[12.5px] italic text-gray-500"
                />
              </DatedEntry>
              {listItem(["education"], i, resume.education.length)}
            </div>
          ))}
          <AddButton
            label="Add education"
            onClick={() => addItem(["education"], NEW_EDU)}
          />
        </section>
      )}

      {show("accomplishments") && (
        <section id="section-accomplishments" className="space-y-2">
          <SectionHeading>Accomplishments</SectionHeading>
          <ul className="bullets space-y-1.5">
            {resume.accomplishments.map((item, i) => (
              <li key={i} className="group/bullet relative">
                <EditableText
                  tag="span"
                  multiline
                  html={item}
                  onChange={(v) => setField(["accomplishments", i], v)}
                  className="block"
                />
                {listItem(
                  ["accomplishments"],
                  i,
                  resume.accomplishments.length,
                )}
              </li>
            ))}
          </ul>
          <AddButton
            label="Add accomplishment"
            onClick={() => addItem(["accomplishments"], "New accomplishment.")}
          />
        </section>
      )}

      {show("references") && (
        <section id="section-references" className="space-y-3">
          <SectionHeading>References</SectionHeading>
          <div className="grid gap-3 sm:grid-cols-2">
            {resume.references.map((ref, i) => (
              <div
                key={i}
                className="group/item relative text-[12.5px] leading-snug"
              >
                <EditableText
                  html={ref.name}
                  onChange={(v) => setField(["references", i, "name"], v)}
                  className="font-bold text-gray-900"
                />
                <EditableText
                  html={ref.company}
                  onChange={(v) => setField(["references", i, "company"], v)}
                  className="italic text-gray-500"
                />
                <EditableText
                  html={ref.contact}
                  onChange={(v) => setField(["references", i, "contact"], v)}
                  className="text-gray-700"
                />
                {listItem(["references"], i, resume.references.length)}
              </div>
            ))}
          </div>
          <AddButton
            label="Add reference"
            onClick={() => addItem(["references"], NEW_REF)}
          />
        </section>
      )}
    </div>
  );
}
