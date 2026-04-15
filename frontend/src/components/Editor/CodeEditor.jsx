import Editor from "@monaco-editor/react";
import axios from "axios";

export default function CodeEditor({ code, setCode, setOutput }) {
  const runCode = async () => {
    try {
      setOutput("Running...");

      const res = await axios.post(
        "https://ce.judge0.com/submissions?base64_encoded=false&wait=true",
        {
          source_code: code,
          language_id: 63, // JS
        }
      );

      setOutput(res.data.stdout || res.data.stderr || "No output");
    } catch (err) {
      console.log(err);
      setOutput("❌ Error running code (check API key)");
    }
  };

  return (
    <>
      <button
        onClick={runCode}
        style={{
          marginBottom: 10,
          background: "#22c55e",
          border: "none",
          padding: "6px 12px",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        ▶ Run
      </button>

      <Editor
        height="100%"
        theme="vs-dark"
        language="javascript"
        value={code}
        onChange={(val) => setCode(val)}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          wordBasedSuggestions: true,
        }}
      />
    </>
  );
}
