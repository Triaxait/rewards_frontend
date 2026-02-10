import Input from "../components/Input";
import Button from "../components/Button";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api/customer";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const update = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Enter a valid email address";

    if (!form.password || form.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;


    try {
      setLoading(true);

      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const userdata=res.user;
      const accessToken=res.accessToken;
      login(
        userdata,
        accessToken,
      );

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

        {/* Logo */}
        <div className="flex justify-center">
          <Logo />
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-text tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted max-w-xs">
            Sign in to continue to your account
          </p>
        </div>

        {/* Form */}
        <div
          className="space-y-4"
          onKeyDown={(e) => e.key === "Enter" && submit()}
        >
          <Input
            placeholder="Email address"
            name="email"
            value={form.email}
            onChange={update}
            error={errors.email}
          />

          <Input
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={update}
            error={errors.password}
          />
        </div>

        {/* CTA */}
        <Button onClick={submit} disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>

        {/* Footer */}
        <p className="text-sm text-muted">
          New here?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-primary cursor-pointer hover:underline"
          >
            Create an account
          </span>
        </p>

      </div>
    </div>
  );
}
