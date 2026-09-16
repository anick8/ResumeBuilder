import { ResumeProvider } from "./hooks/useResume.jsx";
import { EditorPage } from "./pages/EditorPage.jsx";

function App() {
  return (
    <ResumeProvider>
      <EditorPage />
    </ResumeProvider>
  );
}

export default App;
