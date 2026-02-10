import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "../services/api/customer";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dob: "",
  });

  const [errors, setErrors] = useState({});
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (e) => {
    let { name, value } = e.target;

    // Sanitize phone input
    if (name === "mobile") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const isAdult = (dob) => {
    const birth = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 18;
  };

  const validate = () => {
    const newErrors = {};

    if (form.firstName.trim().length < 2)
      newErrors.firstName = "First name must be at least 2 characters";

    if (form.lastName.trim().length < 2)
      newErrors.lastName = "Last name must be at least 2 characters";

    if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Enter a valid email address";

    if (!/^\d{10}$/.test(form.mobile))
      newErrors.phone = "Enter a valid 10-digit phone number";

    if (!form.dob) newErrors.dob = "Date of birth is required";
    else if (!isAdult(form.dob))
      newErrors.dob = "You must be at least 18 years old";

    if (!accepted) newErrors.terms = "Please accept the terms to continue";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;

    setLoading(true);

   try {
  setLoading(true);

  const res = await apiFetch("/auth/signup", {
    method: "POST",
    body: JSON.stringify(form),
  });

  // store pending token
  localStorage.setItem("pendingToken", res.token);

  setLoading(false);
  navigate("/verify-otp");
} catch (err) {
  setLoading(false);
  alert(err.message);
}

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-6">
      <div className="w-full max-w-sm space-y-8">
        {/* Back */}
        <p
          onClick={() => navigate("/login")}
          className="
          flex items-center gap-2
          text-sm text-muted
          cursor-pointer
          hover:underline
          w-fit
        ">
          <span className="text-lg leading-none">←</span>
          Back to login
        </p>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-text tracking-tight">
            Create account
          </h1>
          <p className="text-sm text-muted max-w-xs">
            Sign up to get started with your account
          </p>
        </div>

        {/* Form */}
        <div
          className="space-y-4"
          onKeyDown={(e) => e.key === "Enter" && submit()}
        >
          <Input
            placeholder="First name"
            name="firstName"
            value={form.firstName}
            onChange={update}
            error={errors.firstName}
          />

          <Input
            placeholder="Last name"
            name="lastName"
            value={form.lastName}
            onChange={update}
            error={errors.lastName}
          />

          <Input
            placeholder="Email address"
            name="email"
            value={form.email}
            onChange={update}
            error={errors.email}
          />

          <Input
            placeholder="Phone number"
            name="mobile"
            value={form.mobile}
            onChange={update}
            error={errors.phone}
          />

          <Input
            type="date"
            name="dob"
            value={form.dob}
            onChange={update}
            error={errors.dob}
          />
        </div>

        {/* Terms */}
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border border-border accent-primary"
            />
            <p className="text-sm text-muted leading-relaxed">
              I agree to the{" "}
              <span className="text-primary cursor-pointer hover:underline">
                Terms & Conditions
              </span>{" "}
              and{" "}
              <span className="text-primary cursor-pointer hover:underline">
                Privacy Policy
              </span>
            </p>
          </div>

          {errors.terms && (
            <p className="text-xs text-red-500">{errors.terms}</p>
          )}
        </div>

        {/* CTA */}
        <Button onClick={submit} disabled={!accepted || loading}>
          {loading ? "Creating account…" : "Sign up"}
        </Button>
      </div>
    </div>
  );
}
