export default function FileExplorer({ files, setActiveFile }) {
  return (
    <div style={{ padding: "10px" }}>
      <h4>📁 Files</h4>

      {files.map((file, i) => (
        <div key={i} onClick={() => setActiveFile(file)} style={{ cursor: "pointer" }}>
          📄 {file.path}
        </div>
      ))}
    </div>
  );
}