import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/Button";
import { apiFetch } from "../../services/api/customer";

export default function SetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    setError("");

    if (!password || password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    if (!token) {
      return setError("Invalid or expired link");
    }

    try {
      setLoading(true);

      await apiFetch("/staff/set-password", {
        method: "POST",
        body: JSON.stringify({
          token,
          password,
        }),
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     SUCCESS SCREEN
     ====================== */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <h1 className="text-2xl font-semibold text-text">
            You’re onboarded 🎉
          </h1>

          <p className="text-sm text-muted">
            Your account has been set up successfully.
          </p>

          <Button onClick={() => navigate("/staff/home")}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  /* ======================
     SET PASSWORD FORM
     ====================== */
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm space-y-6">

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-text">
            Set your password
          </h1>
          <p className="text-sm text-muted">
            Create a password to activate your account
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              border border-border
              rounded-lg
              px-3 py-2
              text-sm
              focus:outline-none
              focus:border-primary
            "
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="
              w-full
              border border-border
              rounded-lg
              px-3 py-2
              text-sm
              focus:outline-none
              focus:border-primary
            "
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        <Button onClick={submit} disabled={loading}>
          {loading ? "Setting password…" : "Set password"}
        </Button>
      </div>
    </div>
  );
}
