import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../services/api/customer";

export default function QrModal({ open, onClose }) {
  const [qrToken, setQrToken] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(!open) return;
    const fetchQrToken = async () => {
      try {
        setLoading(true);
        setQrToken(null);

        const accessToken = localStorage.getItem("accessToken");
        
        if (!accessToken) {
          throw new Error("Invalid token");
        }
        const res = await apiFetch("/qr-token", {
          method: "GET",
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });

        if (!res.qrToken) throw new Error("Failed to fetch QR");

        setQrToken(res.qrToken);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQrToken();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      {/* Blur backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
      />

      {/* QR Card */}
      <div
        className="
          absolute inset-0
          flex items-center justify-center
          px-6
          pointer-events-none
        "
      >
        <div
          className="
            bg-white
            rounded-2xl
            shadow-soft
            p-8
            text-center
            space-y-4
            pointer-events-auto
          "
        >
          <p className="text-sm text-muted">
            Show this QR at the counter
          </p>

          <div
            className="
              w-48 h-48
              rounded-xl
              flex items-center justify-center
            "
          >
            {loading && (
              <p className="text-sm text-muted">Generating QR…</p>
            )}

            {!loading && qrToken && (
              <QRCodeCanvas
                value={qrToken}
                size={192}
                level="M"
                includeMargin
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
