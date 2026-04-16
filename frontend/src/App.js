import { useEffect, useState, useRef } from "react";
import "./awsConfig";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import "./App.css";

import AuthLayout from "./components/Auth/AuthLayout";
import AuthCard from "./components/Auth/AuthCard";

import Sidebar from "./components/Layout/Sidebar";
import CodeEditor from "./components/Editor/CodeEditor";
import OutputPanel from "./components/Compiler/OutputPanel";

function App() {
  const containerRef = useRef(null);
  const isDraggingRef = useRef(false);

  const [user, setUser] = useState(null);
  const [page, setPage] = useState("login");

  const [repo, setRepo] = useState(null);
  const [files, setFiles] = useState({
    "main.js": 'console.log("hello")',
  });
  const [activeFile, setActiveFile] = useState("main.js");

  const [output, setOutput] = useState("");
  const [showOutput, setShowOutput] = useState(true);

  // 🔐 AUTH
  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  // 🌐 AUTO JOIN FROM URL
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  let repoFromURL = params.get("repo");

  if (!repoFromURL) {
    repoFromURL = Math.random().toString(36).substring(2, 8);

    window.history.replaceState(null, "", `?repo=${repoFromURL}`);
  }

  setRepo(repoFromURL);
}, []);

  // ⌨️ CTRL + `
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.key === "`") {
        setShowOutput((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // 🧱 RESIZER
  useEffect(() => {
    const resizer = document.querySelector(".resizer");

    const onMouseDown = () => {
      isDraggingRef.current = true;
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current || !containerRef.current) return;

      const editor = containerRef.current.querySelector(".editor-pane");
      const output = containerRef.current.querySelector(".output-pane");

      if (!editor || !output) return;

      const rect = containerRef.current.getBoundingClientRect();
      const percent = ((e.clientY - rect.top) / rect.height) * 100;

      if (percent > 15 && percent < 85) {
        editor.style.height = `${percent}%`;
        output.style.height = `${100 - percent}%`;
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    resizer?.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      resizer?.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  if (!user) {
    return (
      <AuthLayout>
        <AuthCard
          page={page}
          setPage={setPage}
          onLogin={() => window.location.reload()}
        />
      </AuthLayout>
    );
  }

  return (
    <div className="app-container">
      <Sidebar
        files={files}
        setFiles={setFiles}
        setActiveFile={setActiveFile}
        repo={repo}
        setRepo={setRepo}
      />

      <div className="main">
        <div className="topbar">
          ⚡ Real-Time Code Editor
          <button onClick={signOut}>Logout</button>
        </div>

        <div className="editor-output-wrapper" ref={containerRef}>
          <div className="editor-pane">
            <CodeEditor
  files={files}
  setFiles={setFiles}
  activeFile={activeFile}
  setOutput={setOutput}
  repoId={repo}
/>
          </div>

          {showOutput && (
            <>
              <div className="resizer" />
              <div className="output-pane">
                <OutputPanel output={output} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;