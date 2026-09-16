import { useResume } from "../hooks/useResume.jsx";
import { EditableText } from "./EditableText.jsx";
import { AddButton, ItemControls } from "./ListControls.jsx";
import { TopoBackground } from "./TopoBackground.jsx";
import {
  CalendarIcon,
  GlobeIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  StarIcon,
} from "./icons.jsx";

/** @param {{ children: import('react').ReactNode }} props */
function Heading({ children }) {
  return <h2 className="m-heading">{children}</h2>;
}

const NEW_JOB = {
  role: "Job Title",
  company: "Company",
  dates: "01/2024 - Present",
  location: "City",
  description: "One line about the company.",
  bullets: ["Describe what you achieved here."],
};
const NEW_EDU = {
  degree: "Degree",
  school: "School",
  dates: "07/2010 - 07/2014",
  location: "City",
};
const NEW_REF = {
  name: "Name - Title",
  company: "Company, City",
  contact: "phone, email",
};

/**
 * Header + two-column template (wide main column left, narrow right column).
 * Main column renders first in DOM order for ATS-friendly extraction.
 * @param {{ resume: object, hidden: string[] }} props
 */
export function ModernTemplate({ resume, hidden }) {
  const { setField, addItem, removeItem, moveItem } = useResume();
  const show = (id) => !hidden.includes(id);
  const controls = (path, i, len) => (
    <ItemControls
      onRemove={() => removeItem(path, i)}
      onUp={i > 0 ? () => moveItem(path, i, i - 1) : undefined}
      onDown={i < len - 1 ? () => moveItem(path, i, i + 1) : undefined}
    />
  );
  const skillOrder = resume.skillOrder;
  const tags = resume.tags || [];
  const languages = resume.languages || [];

  return (
    <div className="modern relative px-10 py-9">
      <TopoBackground />
      <header className="relative mb-6">
        <EditableText
          tag="h1"
          html={resume.name}
          onChange={(v) => setField(["name"], v)}
          className="m-name"
        />
        <EditableText
          html={resume.title}
          onChange={(v) => setField(["title"], v)}
          className="m-title"
        />
        <ul className="m-contact">
          {[
            ["phone", PhoneIcon],
            ["email", MailIcon],
            ["linkedin", GlobeIcon],
            ["address", PinIcon],
          ].map(([key, Icon]) => (
            <li key={key}>
              <Icon />
              <EditableText
                tag="span"
                html={resume.contact[key] || ""}
                placeholder={key}
                onChange={(v) => setField(["contact", key], v)}
              />
            </li>
          ))}
        </ul>
      </header>

      <div className="m-columns relative">
        {/* ---------- main column ---------- */}
        <div className="m-main space-y-7">
          {show("summary") && (
            <section id="section-summary">
              <Heading>Summary</Heading>
              <EditableText
                multiline
                html={resume.summary}
                onChange={(v) => setField(["summary"], v)}
                className="m-body"
              />
            </section>
          )}

          {show("workHistory") && (
            <section id="section-workHistory">
              <Heading>Work Experience</Heading>
              <div className="divide-y divide-dashed divide-gray-300">
                {resume.workHistory.map((job, j) => {
                  const order = job.bulletOrder || job.bullets.map((_, i) => i);
                  return (
                    <div
                      key={j}
                      className="group/item relative py-3 first:pt-0"
                    >
                      <EditableText
                        html={job.role}
                        onChange={(v) =>
                          setField(["workHistory", j, "role"], v)
                        }
                        className="m-role"
                      />
                      <EditableText
                        html={job.company}
                        onChange={(v) =>
                          setField(["workHistory", j, "company"], v)
                        }
                        className="m-company"
                      />
                      <div className="m-meta">
                        <span>
                          <CalendarIcon />
                          <EditableText
                            tag="span"
                            html={job.dates}
                            onChange={(v) =>
                              setField(["workHistory", j, "dates"], v)
                            }
                          />
                        </span>
                        <span>
                          <PinIcon />
                          <EditableText
                            tag="span"
                            html={job.location || ""}
                            placeholder="Location"
                            onChange={(v) =>
                              setField(["workHistory", j, "location"], v)
                            }
                          />
                        </span>
                      </div>
                      <EditableText
                        multiline
                        html={job.description || ""}
                        placeholder="One line about the company"
                        onChange={(v) =>
                          setField(["workHistory", j, "description"], v)
                        }
                        className="m-body mt-1"
                      />
                      <ul className="m-bullets">
                        {job.bullets.map((bullet, b) => {
                          const idx = order[b];
                          return (
                            <li key={idx} className="group/bullet relative">
                              <EditableText
                                tag="span"
                                multiline
                                html={bullet}
                                onChange={(v) =>
                                  setField(
                                    ["workHistory", j, "bullets", idx],
                                    v,
                                  )
                                }
                                className="block"
                              />
                              {controls(
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
                          addItem(
                            ["workHistory", j, "bullets"],
                            "New achievement.",
                          )
                        }
                      />
                      {controls(["workHistory"], j, resume.workHistory.length)}
                    </div>
                  );
                })}
              </div>
              <AddButton
                label="Add job"
                onClick={() => addItem(["workHistory"], NEW_JOB)}
              />
            </section>
          )}
        </div>

        {/* ---------- side column ---------- */}
        <div className="m-side space-y-7">
          {show("education") && (
            <section id="section-education">
              <Heading>Education</Heading>
              {resume.education.map((edu, i) => (
                <div key={i} className="group/item relative mb-3">
                  <EditableText
                    html={edu.degree}
                    onChange={(v) => setField(["education", i, "degree"], v)}
                    className="m-role"
                  />
                  <EditableText
                    html={edu.school}
                    onChange={(v) => setField(["education", i, "school"], v)}
                    className="m-company"
                  />
                  <div className="m-meta">
                    <span>
                      <CalendarIcon />
                      <EditableText
                        tag="span"
                        html={edu.dates}
                        onChange={(v) => setField(["education", i, "dates"], v)}
                      />
                    </span>
                    <span>
                      <PinIcon />
                      <EditableText
                        tag="span"
                        html={edu.location || ""}
                        placeholder="City"
                        onChange={(v) =>
                          setField(["education", i, "location"], v)
                        }
                      />
                    </span>
                  </div>
                  {controls(["education"], i, resume.education.length)}
                </div>
              ))}
              <AddButton
                label="Add education"
                onClick={() => addItem(["education"], NEW_EDU)}
              />
            </section>
          )}

          {show("languages") && (
            <section id="section-languages">
              <Heading>Languages</Heading>
              <div className="divide-y divide-dashed divide-gray-300">
                {languages.map((lang, i) => (
                  <div
                    key={i}
                    className="group/item relative flex items-center justify-between py-2"
                  >
                    <div>
                      <EditableText
                        html={lang.name}
                        onChange={(v) => setField(["languages", i, "name"], v)}
                        className="m-role"
                      />
                      <EditableText
                        html={lang.level}
                        onChange={(v) => setField(["languages", i, "level"], v)}
                        className="text-[11.5px] text-gray-500"
                      />
                    </div>
                    <div
                      className="m-dots"
                      role="img"
                      aria-label={`${lang.dots} of 5`}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          className={`m-dot ${n <= lang.dots ? "on" : ""}`}
                          onClick={() => setField(["languages", i, "dots"], n)}
                          title={`${n}/5`}
                        />
                      ))}
                    </div>
                    {controls(["languages"], i, languages.length)}
                  </div>
                ))}
              </div>
              <AddButton
                label="Add language"
                onClick={() =>
                  addItem(["languages"], {
                    name: "Language",
                    level: "Level",
                    dots: 3,
                  })
                }
              />
            </section>
          )}

          {show("skills") && (
            <section id="section-skills">
              <Heading>Skills</Heading>
              <ul className="m-chips">
                {tags.map((tag, i) => (
                  <li key={i} className="group/item relative m-chip">
                    <EditableText
                      tag="span"
                      html={tag}
                      onChange={(v) => setField(["tags", i], v)}
                    />
                    {controls(["tags"], i, tags.length)}
                  </li>
                ))}
              </ul>
              <AddButton
                label="Add skill"
                onClick={() => addItem(["tags"], "New skill")}
              />
              {skillOrder && (
                <p className="no-print mt-1 text-[10px] text-gray-400">
                  Skill bars from the sidebar template are hidden here.
                </p>
              )}
            </section>
          )}

          {show("accomplishments") && (
            <section id="section-accomplishments">
              <Heading>Key Achievements</Heading>
              <div className="space-y-3">
                {resume.accomplishments.map((item, i) => (
                  <div key={i} className="group/item relative flex gap-2">
                    <span className="m-ach-icon">
                      <StarIcon />
                    </span>
                    <EditableText
                      tag="span"
                      multiline
                      html={item}
                      onChange={(v) => setField(["accomplishments", i], v)}
                      className="m-body block flex-1"
                    />
                    {controls(
                      ["accomplishments"],
                      i,
                      resume.accomplishments.length,
                    )}
                  </div>
                ))}
              </div>
              <AddButton
                label="Add achievement"
                onClick={() =>
                  addItem(
                    ["accomplishments"],
                    "<strong>Title</strong> — details.",
                  )
                }
              />
            </section>
          )}

          {show("references") && (
            <section id="section-references">
              <Heading>References</Heading>
              <div className="divide-y divide-dashed divide-gray-300">
                {resume.references.map((ref, i) => (
                  <div
                    key={i}
                    className="group/item relative py-2 text-[12px] leading-snug"
                  >
                    <EditableText
                      html={ref.name}
                      onChange={(v) => setField(["references", i, "name"], v)}
                      className="m-role"
                    />
                    <EditableText
                      html={ref.company}
                      onChange={(v) =>
                        setField(["references", i, "company"], v)
                      }
                      className="text-gray-600"
                    />
                    <EditableText
                      html={ref.contact}
                      onChange={(v) =>
                        setField(["references", i, "contact"], v)
                      }
                      className="text-gray-600"
                    />
                    {controls(["references"], i, resume.references.length)}
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
      </div>
    </div>
  );
}
