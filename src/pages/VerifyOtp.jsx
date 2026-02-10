import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../services/api/customer";

export default function VerifyOtp() {
  const navigate = useNavigate();

  // otp state
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);

  // resend timer (60s)
  const [timer, setTimer] = useState(60);


  useEffect(() => {
    console.log("OTP sent to user's email");

    setTimer(60);
  }, []);

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;

    try{
 
    const pendingToken = localStorage.getItem("pendingToken");

    const res = await apiFetch("/auth/verify-otp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${pendingToken}`,
        },
        body: JSON.stringify({
          otp: code,
        }),
      });
      navigate("/create-password");
    } catch (err) {

      alert(err.message);
    }
  };

  const resendOtp = async () => {

    try{
      const pendingToken = localStorage.getItem("pendingToken");

    const res = await apiFetch("/auth/resend-otp", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${pendingToken}`,
        }
      });
      alert("OTP resent to your email");
    } catch (err) {
  
      alert(err.message);
    }

    setTimer(60);
  };

  /* ======================
     TIMER
     ====================== */
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* ======================
     OTP INPUT HANDLING
     ====================== */
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm space-y-8">

        {/* Back */}
        <p
          onClick={() => navigate("/signup")}
          className="flex items-center gap-2 text-sm text-muted cursor-pointer hover:underline w-fit"
        >
          <span className="text-lg leading-none">←</span>
          Back
        </p>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-text tracking-tight">
            Verify your account
          </h1>
          <p className="text-sm text-muted max-w-xs">
            OTP has been sent to your email address
          </p>
        </div>

        {/* OTP INPUT */}
        <div className="flex justify-between gap-2">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              value={digit}
              onChange={(e) =>
                handleOtpChange(e.target.value, i)
              }
              onKeyDown={(e) => handleKeyDown(e, i)}
              maxLength={1}
              className="
                w-12 h-12
                text-center text-lg
                rounded-lg
                border border-border
                bg-white
                focus:outline-none
                focus:border-primary
              "
            />
          ))}
        </div>

        {/* Verify */}
        <Button
          onClick={verifyOtp}
          disabled={otp.join("").length !== 6}
        >
          Verify
        </Button>

        {/* Resend */}
        <p className="text-xs text-muted text-center">
          Didn’t receive the code?{" "}
          {timer > 0 ? (
            <span className="opacity-60">
              Resend in {timer}s
            </span>
          ) : (
            <span
              className="text-primary cursor-pointer hover:underline"
              onClick={resendOtp}
            >
              Resend OTP
            </span>
          )}
        </p>

      </div>
    </div>
  );
}
