import { useState } from "react";
import { confirmSignUp } from "aws-amplify/auth";
import Button from "../Common/Button";

export default function VerifyOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  async function handleVerify(e) {
    e.preventDefault();

    console.log("Verify clicked");
    console.log("Email:", email);
    console.log("OTP:", otp);

    try {
      const res = await confirmSignUp({
        username: email,
        confirmationCode: otp,
      });

      console.log("Verification response:", res);

      alert("✅ Email verified! Login now.");

    } catch (error) {
      console.error("Verification error:", error);
      alert("❌ " + error.message);
    }
  }

  return (
    <form className="auth-card" onSubmit={handleVerify}>
      <h2>Verify Email</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="OTP"
        value={otp}
        required
        onChange={(e) => setOtp(e.target.value)}
      />

      <Button text="Verify OTP" type="submit" />
    </form>
  );
}