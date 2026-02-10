import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../services/api/customer";
import { useSearchParams } from "react-router-dom";
export default function ScanQR() {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
    const [params] = useSearchParams();
    const siteId = params.get("siteId");
  /* ======================
     START SCANNER
     ====================== */
  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    const startScan = async () => {
      try {
        setScanning(true);

        await scanner.start(
          { facingMode: "environment" }, // rear camera
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText) => {
            // Stop scanning immediately
            await scanner.stop();
            setScanning(false);

            verifyCustomer(decodedText);
          }
        );
      } catch (err) {
        setError("Camera permission denied or unavailable");
        setScanning(false);
      }
    };

    startScan();

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  /* ======================
     VERIFY CUSTOMER
     ====================== */
  const verifyCustomer = async (qrData) => {
    try {
      const res = await apiFetch("/staff/scan-qr", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
            siteId,
          qrToken : qrData,
        }),
      });

      // ONLY navigate after backend confirmation
      navigate(`/staff/transactions?qrToken=${qrData}&siteId=${siteId}`);
    } catch (err) {
      setError(err.message || "Invalid QR code");
    }
  };

  return (
    <div className="min-h-screen bg-bg px-5 pt-6 space-y-6 max-w-md mx-auto">

      <h1 className="text-lg font-semibold text-text text-center">
        Scan Customer QR
      </h1>

      {/* Camera View */}
      <div
        id="qr-reader"
        className="
          w-full
          aspect-square
          border border-border
          rounded-2xl
          overflow-hidden
          bg-black
        "
      />

      {scanning && (
        <p className="text-xs text-muted text-center">
          Point camera at QR code
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500 text-center">
          {error}
        </p>
      )}
    </div>
  );
}
