import React from 'react'

const Topbar = () => {
  return (
    <>
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
    </>
  )
}

export default Topbar
