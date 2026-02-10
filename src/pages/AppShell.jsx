import { useState } from "react";
import HomePage from "./HomePage";
import ProfilePage from "./ProfilePage";
import QrModal from "../components/QrModal";
import BottomNav from "../components/BottomNav";
import RewardsHistory from "./RewardHistory";

export default function AppShell() {
  const [active, setActive] = useState("home");
  const [qrOpen, setQrOpen] = useState(false);
  const [page, setPage] = useState("home");

  return (
    <div className="min-h-screen bg-bg pb-32 relative">


      <QrModal open={qrOpen} onClose={() => setQrOpen(false)} />
      {active === "home" && <HomePage />}
    {active === "profile" && <ProfilePage />}

      <BottomNav
        active={active}
        onChange={setActive}
        qrOpen={qrOpen}
        onQrToggle={() => setQrOpen(!qrOpen)}
      />
    </div>
  );
}
