import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api/customer";
import Input from "../components/Input";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      setLoading(true);

      await apiFetch("/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card shadow-lg rounded-2xl p-8">

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center mb-2">
          Forgot Password
        </h2>

        <p className="text-sm text-muted text-center mb-6">
          Enter your email and we’ll send you a reset link.
        </p>

        {success ? (
          <div className="text-center">
            <p className="text-sm text-green-600 mb-4">
              If the email exists, a reset link has been sent.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="text-primary hover:underline text-sm"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email Input */}
            <div>
                <Input
    type="email"
    name="email"
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
                
             
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            {/* Back to login */}
            <p className="text-sm text-muted text-center mt-4">
              Remember your password?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-primary cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>

          </form>
        )}
      </div>
    </div>
  );
}