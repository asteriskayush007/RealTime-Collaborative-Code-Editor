import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

// ✅ SINGLE SOCKET INSTANCE
const socket = io("https://realtime-collaborative-code-editor-mvpt.onrender.com/");

// ✅ LANGUAGE MAP
const LANGUAGES = {
  javascript: 63,
  python: 71,
  cpp: 54,
  java: 62,
};

// ✅ DEFAULT CODE
const DEFAULT_CODE = {
  javascript: 'console.log("Hello JS")',
  python: 'print("Hello Python")',
  cpp: '#include <iostream>\nusing namespace std;\nint main(){ cout<<"Hello"; return 0; }',
  java: 'class Main { public static void main(String[] args){ System.out.println("Hello"); }}',
};

export default function CodeEditor({
  files,
  setFiles,
  activeFile,
  repoId,
  setOutput,
}) {
  const isRemoteUpdate = useRef(false);

  const [language, setLanguage] = useState("javascript");

  // ✅ AUTO LANGUAGE DETECT FROM FILE NAME
  useEffect(() => {
    if (!activeFile) return;

    if (activeFile.endsWith(".py")) setLanguage("python");
    else if (activeFile.endsWith(".cpp")) setLanguage("cpp");
    else if (activeFile.endsWith(".java")) setLanguage("java");
    else setLanguage("javascript");
  }, [activeFile]);

  // ✅ BOILERPLATE ONLY IF FILE EMPTY
  useEffect(() => {
    if (!activeFile) return;

    setFiles((prev) => {
      const existing = prev[activeFile];

      // 🔥 FIX: agar file exist hi nahi karti ya empty hai
      if (existing === undefined || existing.trim() === "") {
        const updated = {
          ...prev,
          [activeFile]: DEFAULT_CODE[language],
        };

        // 🔥 sync bhi bhej dena (IMPORTANT for collab)
        socket.emit("code-change", {
          repoId,
          files: updated,
        });

        return updated;
      }

      return prev;
    });
  }, [activeFile, language]);

  // ✅ JOIN ROOM
  useEffect(() => {
    if (!repoId) return;

    console.log("Joining room:", repoId);

    socket.emit("join-room", repoId);

    socket.on("load-code", (incomingFiles) => {
      console.log("Loaded:", incomingFiles);

      if (incomingFiles) {
        isRemoteUpdate.current = true;
        setFiles(incomingFiles);
      }
    });

    socket.on("code-update", (incomingFiles) => {
      console.log("Update:", incomingFiles);

      isRemoteUpdate.current = true;
      setFiles(incomingFiles);
    });

    return () => {
      socket.off("load-code");
      socket.off("code-update");
    };
  }, [repoId, setFiles]);

  // ✅ HANDLE CHANGE (COLLAB SAFE)
  const handleChange = (val) => {
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    const updatedFiles = {
      ...files,
      [activeFile]: val,
    };

    setFiles(updatedFiles);

    socket.emit("code-change", {
      repoId,
      files: updatedFiles,
    });
  };

  // ✅ RUN CODE
  const runCode = async () => {
    try {
      setOutput("⏳ Running...");

      const res = await axios.post(
        "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
        {
          source_code: files[activeFile] || "",
          language_id: LANGUAGES[language],
        },
      );

      setOutput(res.data.stdout || res.data.stderr || "No output");
    } catch (err) {
      console.log(err);
      setOutput("❌ Error running code");
    }
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* 🔝 TOP BAR */}
      <div
        style={{
          padding: "8px",
          background: "#020617",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LEFT SIDE */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={runCode}
            style={{
              background: "#22c55e",
              border: "none",
              padding: "6px 14px",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ▶ Run
          </button>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: "5px",
              borderRadius: "6px",
            }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>

        {/* RIGHT SIDE 👉 FILE NAME */}
        <div
          style={{
            fontWeight: "bold",
            color: "#38bdf8",
          }}
        >
          📄 {activeFile || "No File"}
        </div>
      </div>

      {/* 🧠 EDITOR */}
      <Editor
        height="100%"
        theme="vs-dark"
        language={language}
        value={files[activeFile] || ""}
        onChange={handleChange}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          quickSuggestions: true,
        }}
      />
    </div>
  );
}
