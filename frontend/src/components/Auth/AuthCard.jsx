import Login from "./Login";
import Signup from "./Signup";
import VerifyOtp from "./VerifyOtp";

export default function AuthCard({ page, setPage, onLogin }) {
  return (
    <div className="auth-card">
      <h2>🔐 Real-Time Code Editor</h2>
      <p>Login to continue</p>

      {/* Tabs */}
      <div className="auth-tabs">
        <div
          className={`auth-tab ${page === "login" ? "active" : ""}`}
          onClick={() => setPage("login")}
        >
          Login
        </div>
        <div
          className={`auth-tab ${page === "signup" ? "active" : ""}`}
          onClick={() => setPage("signup")}
        >
          Signup
        </div>
        <div
          className={`auth-tab ${page === "verify" ? "active" : ""}`}
          onClick={() => setPage("verify")}
        >
          Verify
        </div>
      </div>

      {/* Forms */}
      {page === "login" && <Login onLogin={onLogin} />}
      {page === "signup" && <Signup />}
      {page === "verify" && <VerifyOtp />}
    </div>
  );
}
