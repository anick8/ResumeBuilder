import { ColorPicker } from "../components/ColorPicker.jsx";
import { ExportButton } from "../components/ExportButton.jsx";
import { FormatToolbar } from "../components/FormatToolbar.jsx";
import { JobDescriptionInput } from "../components/JobDescriptionInput.jsx";
import { ResumeTemplate } from "../components/ResumeTemplate.jsx";
import { SectionsPanel } from "../components/SectionsPanel.jsx";
import { TemplatePicker } from "../components/TemplatePicker.jsx";
import { useResume } from "../hooks/useResume.jsx";
import { useTailoredResume } from "../hooks/useTailoredResume.js";

/** @param {{ title: string, children: import('react').ReactNode }} props */
function Panel({ title, children }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase">
        {title}
      </h3>
      {children}
    </section>
  );
}

/** Controls on the left, live editable A4 preview on the right. */
export function EditorPage() {
  const { design, setAccent, setTemplate, reset } = useResume();
  const { jobDescription, setJobDescription, tailored, matchedKeywords } =
    useTailoredResume();

  const onReset = () => {
    if (
      window.confirm(
        "Reset the resume to the original content? Your edits will be lost.",
      )
    )
      reset();
  };

  return (
    <div className="editor-layout">
      <aside className="no-print controls">
        <div className="mb-4">
          <h1 className="text-lg font-bold text-gray-900">Sea V Builder</h1>
          <p className="text-xs text-gray-500">
            Click any text on the page to edit it.
          </p>
        </div>
        <div className="space-y-4">
          <Panel title="Tailor to a job">
            <JobDescriptionInput
              value={jobDescription}
              onChange={setJobDescription}
              matchedKeywords={matchedKeywords}
            />
          </Panel>
          <Panel title="Template">
            <TemplatePicker
              value={design.template || "sidebar"}
              onChange={setTemplate}
            />
          </Panel>
          <Panel title="Design">
            <ColorPicker accent={design.accent} onChange={setAccent} />
          </Panel>
          <Panel title="Sections">
            <SectionsPanel />
          </Panel>
          <div className="flex flex-col gap-2">
            <ExportButton />
            <button
              type="button"
              onClick={onReset}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              Reset to original
            </button>
          </div>
        </div>
      </aside>

      <main className="preview">
        <ResumeTemplate
          resume={tailored}
          hidden={design.hiddenSections || []}
          template={design.template || "sidebar"}
        />
      </main>

      <FormatToolbar />
    </div>
  );
}
