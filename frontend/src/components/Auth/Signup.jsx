import { useState } from "react";
import { signUp } from "aws-amplify/auth";


export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignup(e) {
    e.preventDefault();

    console.log("🟡 Signup button clicked");
    console.log("📧 Email:", email);
    console.log("🔑 Password:", password);

    try {
      console.log("🚀 Sending signup request to Cognito...");

      const response = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email: email,
          },
        },
      });

      console.log("✅ Signup response from Cognito:", response);
      console.log("🆔 User ID:", response.userId);

      alert("✅ Signup successful! OTP has been sent to your email.");
    } catch (error) {
      console.error("❌ Signup Error:", error);
      alert("❌ " + error.message);
    }
  }

  return (
    <form className="auth-card" onSubmit={handleSignup}>
      <h2>Create Account</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={(e) => {
          console.log("✏️ Email input:", e.target.value);
          setEmail(e.target.value);
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={(e) => {
          console.log("✏️ Password input:", e.target.value);
          setPassword(e.target.value);
        }}
      />

      <button type="submit">Sign Up</button>
    </form>
  );
}
