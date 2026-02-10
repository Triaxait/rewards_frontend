import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import SplashScreen from "../components/SplashScreen";
import Button from "../components/Button";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!user) return null;
  if (isLoggingOut) return <SplashScreen />;

  const fullName = `${user.profile.firstName} ${user.profile.lastName}`;

  return (
    <div className="min-h-screen bg-background px-4 pt-14">
      <div
        className={`w-full max-w-md mx-auto transition-opacity duration-500 ${
          isLoggingOut ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* ======================
            HEADER
        ====================== */}
        <div className="flex flex-col items-center text-center">
          <div className="relative z-10 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-semibold text-primary">
            {user.profile.firstName?.[0]}
            {user.profile.lastName?.[0]}
          </div>

          <h1 className="mt-4 text-2xl font-semibold text-text">
            {fullName}
          </h1>

          <p className="text-sm text-muted">
            {user.profile.email}
          </p>

          <RoleBadge role={user.role} />
        </div>

        {/* ======================
            PROFILE CARD
        ====================== */}
        <div className="mt-6 bg-white rounded-2xl shadow-soft divide-y divide-gray-100 overflow-hidden">
          <ProfileRow label="First Name" value={user.profile.firstName} />
          <ProfileRow label="Last Name" value={user.profile.lastName} />
          <ProfileRow label="Email" value={user.profile.email} />
          <ProfileRow label="Mobile" value={user.profile.mobile} />
          <ProfileRow
            label="Date of Birth"
            value={formatDate(user.profile.dob)}
          />
        </div>

        {/* ======================
            LOGOUT
        ====================== */}
          <div className="mt-10">
        <Button onClick={() => {
            setIsLoggingOut(true);
            setTimeout(logout, 500);
          }} disabled={isLoggingOut}>
                 {isLoggingOut ? "Logging out..." : "Log out"}
                </Button>
          </div>
      </div>
    </div>
  );
}

/* ======================
   REUSABLE ROW
====================== */

function ProfileRow({ label, value }) {
  return (
    <div className="px-6 py-5 flex justify-between items-center">
      <p className="text-xs uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="text-text font-semibold text-right break-all">
        {value || "-"}
      </p>
    </div>
  );
}

/* ======================
   ROLE BADGE
====================== */

function RoleBadge({ role }) {
  const styles = {
    ADMIN: "bg-purple-100 text-purple-700",
    STAFF: "bg-blue-100 text-blue-700",
    CUSTOMER: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={`mt-3 mb-6 inline-block px-4 py-1 rounded-full text-xs font-semibold ${
        styles[role]
      }`}
    >
      {role}
    </span>
  );
}

/* ======================
   DATE FORMATTER
====================== */

function formatDate(dob) {
  if (!dob) return "-";
  return new Date(dob).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}