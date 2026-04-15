import { useState } from "react";

export default function Sidebar({ files = {}, setFiles, setActiveFile }) {
  const [fileName, setFileName] = useState("");

  const createFile = () => {
    const name = fileName.trim();

    if (!name) {
      alert("File name cannot be empty");
      return;
    }

    if (files[name]) {
      alert("File already exists");
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [name]: "",
    }));

    setActiveFile(name);
    setFileName("");
  };

  return (
    <div className="sidebar">
      <h2>📁 Files</h2>

      {/* INPUT */}
      <input
        className="file-input"
        placeholder="new file (e.g. index.js)"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && createFile()}
      />

      {/* BUTTON */}
      <button className="btn" onClick={createFile}>
        + Create File
      </button>

      {/* FILE LIST */}
      <div className="file-list">
        {Object.keys(files).map((file) => (
          <div
            key={file}
            className="file-item"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* FILE NAME */}
            <span
              onClick={() => setActiveFile(file)}
              style={{ cursor: "pointer" }}
            >
              📄 {file}
            </span>

            {/* DELETE BUTTON */}
            <button
              onClick={() => {
                const newFiles = { ...files };
                delete newFiles[file];
                setFiles(newFiles);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "#ef4444",
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
