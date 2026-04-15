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
  const [files, setFiles] = useState({});
  const [activeFile, setActiveFile] = useState("main.js");
  const [output, setOutput] = useState("");
  const [showOutput, setShowOutput] = useState(true);

  // 🔐 AUTH CHECK
  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);
  console.log(repo);

  // 🔥 CTRL + ` toggle output
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.key === "`") {
        setShowOutput((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // 🔥 RESIZER (CLEAN + SAFE)
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
      const offsetY = e.clientY - rect.top;
      const percent = (offsetY / rect.height) * 100;

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

  // 🔐 LOGIN UI
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
      {/* ✅ FIX: Proper props pass */}
      <Sidebar
        files={files}
        setFiles={setFiles}
        setActiveFile={setActiveFile}
        setRepo={setRepo}
      />

      <div className="main">
        {/* 🔝 TOPBAR */}
        <div className="topbar">
          ⚡ Real-Time Code Editor
          <button onClick={signOut}>Logout</button>
        </div>

        {/* 💻 EDITOR + OUTPUT */}
        <div className="editor-output-wrapper" ref={containerRef}>
          <div className="editor-pane">
            <CodeEditor
              code={files[activeFile] || ""}
              setCode={(val) =>
                setFiles((prev) => ({
                  ...prev,
                  [activeFile]: val,
                }))
              }
              setOutput={setOutput}
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