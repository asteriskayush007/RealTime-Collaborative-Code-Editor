import '../../App.css';

export default function OutputPanel({ output }) {
  return (
    <div className="output-container">
      <div className="output-header">⚡ Output</div>
      <pre className="output-text">
        {output || "Run code to see output..."}
      </pre>
    </div>
  );
}