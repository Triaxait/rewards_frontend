import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  // ⏳ Wait until /auth/me finishes
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-muted">Checking session…</p>
      </div>
    );
  }
  // ❌ Not logged in or token invalid
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Role mismatch (admin route protection)
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
}
