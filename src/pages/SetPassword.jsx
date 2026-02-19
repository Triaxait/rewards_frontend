import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import { apiFetch } from "../services/api/customer";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token");

  const [checking, setChecking] = useState(true);
  const [validToken, setValidToken] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ======================
     TOKEN VALIDATION
     ====================== */
  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setValidToken(false);
        setChecking(false);
        return;
      }

      try {
        const res = await apiFetch(
          `/auth/validate-reset-token?token=${token}`
        );

        
        setValidToken(res.valid);
      } catch (err) {
        setValidToken(false);
      } finally {
        setChecking(false);
      }
    };

    checkToken();
  }, [token]);

  /* ======================
     SUBMIT HANDLER
     ====================== */
  const submit = async () => {
    setError("");

    if (!password || password.length < 8) {
      return setError("Password must be at least 8 characters");
    }

    if (password !== confirm) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      await apiFetch("/auth/set-forgot-password", {
        method: "POST",
        body: JSON.stringify({
          token,
          password,
        }),
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     CHECKING SCREEN
     ====================== */
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <p className="text-sm text-muted">Validating link...</p>
      </div>
    );
  }

  /* ======================
     INVALID TOKEN SCREEN
     ====================== */
  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <h1 className="text-xl font-semibold text-text">
            Link expired or invalid
          </h1>

          <p className="text-sm text-muted">
            This reset link is no longer valid. Please request a new one.
          </p>

          <Button onClick={() => navigate("/forgot-password")}>
            Request New Link
          </Button>
        </div>
      </div>
    );
  }

  /* ======================
     SUCCESS SCREEN
     ====================== */
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-6">
        <div className="w-full max-w-sm text-center space-y-6">
          <h1 className="text-2xl font-semibold text-text">
            Password updated successfully 🎉
          </h1>

          <p className="text-sm text-muted">
            You can now login using your new password.
          </p>

          <Button onClick={() => navigate("/login")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  /* ======================
     RESET FORM
     ====================== */
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm space-y-6">

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-text">
            Set New Password
          </h1>
          <p className="text-sm text-muted">
            Create a secure password for your account.
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
          {loading ? "Updating..." : "Set Password"}
        </Button>
      </div>
    </div>
  );
}