import Input from "../components/Input";
import Button from "../components/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api/customer";

export default function CreatePassword() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

  try {
  setLoading(true);

  const pendingToken = localStorage.getItem("pendingToken");

  const res = await apiFetch("/auth/set-password", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${pendingToken}`, // signup token
    },
    body: JSON.stringify({
      password: form.password,
    }),
  });


  login(
    res.user,
    res.accessToken,
  );

  localStorage.removeItem("pendingToken");

  navigate("/");
} catch (err) {
  alert(err.message);
} finally {
  setLoading(false);
}

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm space-y-8">

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-text tracking-tight">
            Create a password
          </h1>
          <p className="text-sm text-muted max-w-xs">
            For security reasons, you need to create a new password before continuing.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="New password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <Input
            type="password"
            placeholder="Confirm password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}
        </div>

        {/* CTA */}
        <Button onClick={submit} disabled={loading}>
          {loading ? "Saving…" : "Continue"}
        </Button>

      </div>
    </div>
  );
}
