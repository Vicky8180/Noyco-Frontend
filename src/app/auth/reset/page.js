"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const defaultEmail = params.get("email") || "";
  const [email, setEmail] = useState(defaultEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null); // null | processing | done
  const router = useRouter();

  useEffect(() => setEmail(defaultEmail), [defaultEmail]);

  const handleSubmit = async () => {
    setError("");
    if (!email || !otp || !newPassword) {
      setError("All fields are required");
      return;
    }
    try {
      setStatus("processing");
      await apiRequest("/auth/password/reset/confirm", {
        method: "POST",
        body: JSON.stringify({ email, otp, new_password: newPassword }),
      });
      setStatus("done");
    } catch (e) {
      console.error(e);
      setError(e?.message || "Unable to reset password");
      setStatus(null);
    }
  };

  if (status === "done") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow text-center space-y-4">
          <h1 className="text-xl font-semibold">Password updated</h1>
          <p className="text-sm text-gray-600">You can now sign in with your new password.</p>
          <button onClick={() => router.push("/auth/login")}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">
            Go to Sign-in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-semibold mb-4 text-center">Reset password</h1>
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="6-digit code"
          maxLength={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="relative mb-3">
          <input
            type={showPwd ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            {showPwd ? "Hide" : "Show"}
          </button>
        </div>
        <button
          onClick={handleSubmit}
          disabled={status === "processing"}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-2 rounded-lg"
        >
          {status === "processing" ? "Resetting…" : "Reset password"}
        </button>
        <button onClick={() => router.push("/auth/login")}
                className="w-full mt-3 text-sm text-gray-500 hover:underline">Back to sign-in</button>
      </div>
    </div>
  );
}
