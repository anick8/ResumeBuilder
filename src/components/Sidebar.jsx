import { useResume } from "../hooks/useResume.jsx";
import { EditableText } from "./EditableText.jsx";
import { AddButton, ItemControls } from "./ListControls.jsx";
import { GlobeIcon, MailIcon, PhoneIcon, PinIcon } from "./icons.jsx";

const CONTACT_ROWS = [
  ["address", PinIcon],
  ["phone", PhoneIcon],
  ["email", MailIcon],
  ["www", GlobeIcon],
];

/**
 * The resume's left sidebar: name, title, contact and skills, all editable.
 * `skills` comes from the (possibly JD-reordered) resume view; edits are
 * written back by original index.
 * @param {{ resume: object, hidden: string[] }} props
 */
export function Sidebar({ resume, hidden }) {
  const { setField, addItem, removeItem, moveItem } = useResume();
  const originalIndex = (skill) =>
    resume.skillOrder
      ? resume.skillOrder[resume.skills.indexOf(skill)]
      : resume.skills.indexOf(skill);

  return (
    <aside
      className="sidebar order-first w-[236px] shrink-0 px-7 py-9 text-white"
      style={{ backgroundColor: "var(--accent)" }}
    >
      <EditableText
        tag="h1"
        html={resume.name}
        onChange={(v) => setField(["name"], v)}
        className="text-[26px] leading-[1.1] font-bold tracking-tight"
      />
      <EditableText
        html={resume.title}
        onChange={(v) => setField(["title"], v)}
        className="mt-2 text-[13px] tracking-wide opacity-85"
      />

      <section className="mt-9" id="section-contact">
        <h2 className="side-heading">Contact</h2>
        <ul className="mt-3 space-y-2.5 text-[12.5px] leading-snug">
          {CONTACT_ROWS.map(([key, Icon]) => (
            <li key={key} className="flex items-start gap-2.5">
              <span className="mt-[3px] shrink-0 opacity-80">
                <Icon />
              </span>
              <EditableText
                tag="span"
                html={resume.contact[key]}
                onChange={(v) => setField(["contact", key], v)}
                className="min-w-0 flex-1 break-words"
              />
            </li>
          ))}
        </ul>
      </section>

      {!hidden.includes("skills") && (
        <section className="mt-9" id="section-skills">
          <h2 className="side-heading">Skills</h2>
          <ul className="mt-3 space-y-3.5 text-[12.5px] leading-snug">
            {resume.skills.map((skill, i) => {
              const idx = originalIndex(skill);
              return (
                <li key={idx} className="group/item relative">
                  <EditableText
                    html={skill.label}
                    onChange={(v) => setField(["skills", idx, "label"], v)}
                  />
                  <div className="mt-1.5 h-[5px] w-full rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={skill.level}
                    onChange={(e) =>
                      setField(["skills", idx, "level"], Number(e.target.value))
                    }
                    className="no-print level-slider"
                    title="Proficiency"
                  />
                  <ItemControls
                    light
                    onRemove={() => removeItem(["skills"], idx)}
                    onUp={
                      i > 0
                        ? () => moveItem(["skills"], idx, idx - 1)
                        : undefined
                    }
                    onDown={
                      i < resume.skills.length - 1
                        ? () => moveItem(["skills"], idx, idx + 1)
                        : undefined
                    }
                  />
                </li>
              );
            })}
          </ul>
          <AddButton
            light
            label="Add skill"
            onClick={() =>
              addItem(["skills"], { label: "New skill", level: 70 })
            }
          />
        </section>
      )}
    </aside>
  );
}
