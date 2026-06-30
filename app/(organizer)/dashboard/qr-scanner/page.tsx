"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { registrationsApi } from "@/lib/api";
import { Loader2, CheckCircle, XCircle, QrCode } from "lucide-react";

export default function QRScannerPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [attendeeDetails, setAttendeeDetails] = useState<any>(null);

  useEffect(() => {
    // Initialize scanner only on client side
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(onScanSuccess, onScanFailure);

    function onScanSuccess(decodedText: string) {
      if (status === "verifying") return; // Prevent multiple scans
      
      setScanResult(decodedText);
      verifyQRCode(decodedText);
      // Optional: pause scanning after success
      // scanner.pause();
    }

    function onScanFailure(error: any) {
      // Ignore background scan errors
    }

    return () => {
      scanner.clear().catch(console.error);
    };
  }, []);

  const verifyQRCode = async (ticketCode: string) => {
    try {
      setStatus("verifying");
      const res = await registrationsApi.verifyQr(ticketCode);
      if (res.data.success) {
        if (res.data.accessGranted) {
          setStatus("success");
          setMessage("Check-in successful!");
          setAttendeeDetails({
            name: res.data.attendee?.name || "Attendee",
            email: res.data.attendee?.email,
            eventTitle: res.data.event?.title
          });
        } else {
          setStatus("error");
          let errorMsg = "Access Denied.";
          if (res.data.paymentReviewEvaluation === "pending_review") {
             errorMsg = "Payment is still pending review.";
          } else if (res.data.paymentReviewEvaluation === "rejected") {
             errorMsg = "Payment was rejected.";
          }
          setMessage(errorMsg);
        }
      }
    } catch (error: any) {
      setStatus("error");
      setMessage(error.response?.data?.message || "Invalid or already used QR Code");
    }
  };

  const resetScanner = () => {
    setScanResult(null);
    setStatus("idle");
    setMessage("");
    setAttendeeDetails(null);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-3">
          <QrCode size={32} className="text-[#006782]" /> QR Check-in Station
        </h1>
        <p className="text-gray-500 font-medium mt-2">Scan attendee QR codes to check them into the event.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Scanner Area */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 overflow-hidden flex flex-col items-center">
          <div id="qr-reader" className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl border-2 border-gray-100" />
          <p className="text-xs text-gray-400 mt-4 text-center font-medium">Position the QR code within the frame.</p>
        </div>

        {/* Result Area */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 flex flex-col justify-center items-center text-center">
          {status === "idle" && (
            <div className="text-gray-400 flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <QrCode size={32} />
              </div>
              <p className="font-medium">Waiting for scan...</p>
            </div>
          )}

          {status === "verifying" && (
            <div className="text-[#006782] flex flex-col items-center">
              <Loader2 className="w-16 h-16 animate-spin mb-4" />
              <p className="font-bold text-lg">Verifying Ticket...</p>
            </div>
          )}

          {status === "success" && (
            <div className="text-green-600 flex flex-col items-center animate-in zoom-in">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-2xl font-black mb-2">Valid Ticket!</h2>
              <p className="font-bold text-green-700 bg-green-50 px-4 py-2 rounded-xl mb-4">{message}</p>
              
              {attendeeDetails && (
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 w-full max-w-sm mb-6 text-left">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Attendee</p>
                  <p className="text-gray-900 font-bold">{attendeeDetails.name}</p>
                  <p className="text-gray-500 text-sm mb-3">{attendeeDetails.email}</p>
                  
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Event</p>
                  <p className="text-[#006782] font-semibold text-sm">{attendeeDetails.eventTitle}</p>
                </div>
              )}

              <button 
                onClick={resetScanner}
                className="bg-[#006782] hover:bg-[#004E63] text-white font-bold rounded-xl px-8 h-12 transition-colors shadow-md"
              >
                Scan Next Ticket
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="text-red-600 flex flex-col items-center animate-in zoom-in">
              <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <XCircle size={48} />
              </div>
              <h2 className="text-2xl font-black mb-2">Access Denied</h2>
              <p className="font-bold text-red-700 bg-red-50 px-4 py-2 rounded-xl mb-6">{message}</p>
              <button 
                onClick={resetScanner}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl px-8 h-12 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
