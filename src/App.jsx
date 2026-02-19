
import { useAuth } from "./context/AuthContext";

/* Public pages */
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyOtp from "./pages/VerifyOtp";
import CreatePassword from "./pages/CreatePassword";
import SetPassword from "./pages/SetPassword";

/* Customer */
import AppShell from "./pages/AppShell";
import RewardsHistory from "./pages/RewardHistory";

/* Admin */
import AdminShell from "./pages/admin/AdminShell";
import AdminStores from "./pages/admin/AdminStores";
import AdminStaff from "./pages/admin/AdminStaff";

/* Staff */
import StaffHome from "./pages/staff/StaffHome";
import ScanQR from "./pages/staff/ScanQr";
import StaffTransaction from "./pages/staff/Transaction";

/* Layout + UI */
import AppLayout from "./layouts/AppLayout";
import SplashScreen from "./components/SplashScreen";

import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/Forgetpassword";
import AdminCustomers from "./pages/admin/AdminCustomers";


/* imports unchanged */

export default function App() {
  const { user, loading } = useAuth();

  const [showSplash, setShowSplash] = useState(true);

  /* ======================
     SPLASH TIMER (3 SECONDS)
     ====================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  /* ======================
     SHOW SPLASH
     ====================== */
  if (loading || showSplash) {
    return <SplashScreen />;
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<RoleRedirect user={user} />} />

        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/create-password" element={<CreatePassword />} />
        <Route path="/reset-password" element={<SetPassword />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* CUSTOMER */}
        {user?.role === "CUSTOMER" && (
          <>
            <Route path="/home" element={<AppShell />} />
            <Route path="/reward-history" element={<RewardsHistory />} />
          </>
        )}

        {/* ADMIN */}
        {user?.role === "ADMIN" && (
          <>
            <Route path="/admin" element={<AdminShell />} />
            <Route path="/admin/stores" element={<AdminStores />} />
            <Route path="/admin/staff" element={<AdminStaff />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
          </>
        )}

        {/* STAFF */}
        {user?.role === "STAFF" && (
          <>
            <Route path="/staff" element={<StaffHome />} />
            <Route path="/staff/scan" element={<ScanQR />} />
            <Route path="/staff/transactions" element={<StaffTransaction />} />
            <Route path="/staff/profile" element={<ProfilePage />} />
          </>
        )}

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AppLayout>
  );
}

function RoleRedirect({ user }) {
  if (!user) return <Navigate to="/login" />;

  if (user.role === "ADMIN") return <Navigate to="/admin" />;
  if (user.role === "STAFF") return <Navigate to="/staff" />;
  return <Navigate to="/home" />;
}
