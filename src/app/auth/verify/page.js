"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "../../../store/hooks";

// Apple-style OTP verification screen for e-mail confirmation
export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const { verifyOTP, sendOTP } = useAuth();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6 digits
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [submitting, setSubmitting] = useState(false);

  // If you want to auto-resend when user refreshes page, uncomment below.
  // We *don't* auto-send inside this component to avoid duplicate e-mails because
  // the signup flow already triggered one OTP.  Users can trigger Resend manually.
  // useEffect(() => {
  //   if (email) sendOTP(email);
  // }, [email]);

  // countdown for resend link
  useEffect(() => {
    if (timer <= 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // handle input change
  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return; // allow single digit only
    const copy = [...otp];
    copy[idx] = val;
    setOtp(copy);
    setError("");

    // auto-focus next box
    if (val && idx < 5) {
      const next = document.getElementById(`otp-${idx + 1}`);
      next && next.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      const prev = document.getElementById(`otp-${idx - 1}`);
      prev && prev.focus();
    }
  };

  const submit = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Enter 6-digit code");
      return;
    }
    setSubmitting(true);
    const res = await verifyOTP(email, code);
    setSubmitting(false);
    if (!res.success) {
      setError(res.error?.message || "Invalid or expired code");
      return;
    }
    router.push("/auth/login?verified=1");
  };

  const resend = async () => {
    await sendOTP(email);
    setTimer(60);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-center">Verify your e-mail</h1>
        <p className="text-sm text-gray-600 text-center">
          We've sent a 6-digit code to <span className="font-medium">{email}</span>
        </p>

        {/* OTP boxes */}
        <div className="flex justify-between">
          {otp.map((d, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              className="w-12 h-14 rounded-xl border border-gray-300 text-center text-lg font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              value={d}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              maxLength={1}
              inputMode="numeric"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-center text-sm -mt-2">{error}</p>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="w-full py-3 bg-black text-white rounded-xl hover:opacity-90 transition disabled:opacity-60"
        >
          {submitting ? "Verifying…" : "Verify & Continue"}
        </button>

        <div className="text-center text-xs text-gray-500">
          {timer > 0 ? (
            <>Resend code in {timer}s</>
          ) : (
            <button onClick={resend} className="text-blue-600 hover:underline">
              Resend code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
