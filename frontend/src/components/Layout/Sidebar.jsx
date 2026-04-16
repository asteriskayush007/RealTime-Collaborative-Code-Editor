import { useState } from "react";

export default function Sidebar({
  files = {},
  setFiles,
  setActiveFile,
  repo,
  repoId,
  setRepo,
}) {
  const [fileName, setFileName] = useState("");

  // 📁 CREATE FILE
  const createFile = () => {
    const name = fileName.trim();

    if (!name) return alert("File name cannot be empty");
    if (files[name]) return alert("File already exists");

    setFiles((prev) => ({
      ...prev,
      [name]: "",
    }));

    setActiveFile(name);
    setFileName("");
  };

  // 🚀 CREATE REPO
  const createRepo = () => {
  const id = Math.random().toString(36).substring(2, 8);
  setRepo(id);

  window.location.href = `?repo=${id}`; // reload with same repo

  console.log("🧠 Current Repo:", repoId);
};

  return (
    <div className="sidebar">
      <h2>📁 Files</h2>

      {/* 🧠 REPO CONTROLS */}
      <button className="btn" onClick={createRepo}>
        🚀 Create Repo
      </button>

      <button
        className="btn"
        onClick={() => {
          if (!repo) return alert("Create repo first!");

          const link = `${window.location.origin}?repo=${repo}`;
          navigator.clipboard.writeText(link);
          alert("🔗 Link copied!");
        }}
      >
        🔗 Share Repo
      </button>

      {/* 📄 FILE INPUT */}
      <input
        className="file-input"
        placeholder="new file (e.g. index.js)"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && createFile()}
      />

      <button className="btn" onClick={createFile}>
        + Create File
      </button>

      {/* 📂 FILE LIST */}
      <div className="file-list">
        {Object.keys(files).map((file) => (
          <div
            key={file}
            className="file-item"
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span onClick={() => setActiveFile(file)}>📄 {file}</span>

            <button
              onClick={() => {
                const newFiles = { ...files };
                delete newFiles[file];
                setFiles(newFiles);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "red",
                cursor: "pointer",
              }}
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}