"use client";
import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function Setup2FA() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [totpURI, setTotpURI] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Enabling TOTP in Better Auth returns the URI which can be used to generate a QR code
    const { data, error } = await authClient.twoFactor.enable({
      password,
    });

    if (error) {
      toast.error(error.message || "Failed to generate 2FA secret. Check password.");
    } else if (data) {
      if (data.totpURI) {
        setTotpURI(data.totpURI);
        toast.success("Scan the QR code with Google Authenticator!");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-brand-dark/80 p-8 rounded-2xl border border-brand-line max-w-md w-full shadow-2xl relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-brand-yellow/20 rounded-full blur-[50px] pointer-events-none"></div>
          
          <h2 className="text-3xl font-black text-white mb-2 text-center relative z-10">Setup 2FA</h2>
          <p className="text-brand-muted mb-8 text-center relative z-10">Link your authenticator app</p>
          
          {!totpURI ? (
            <form onSubmit={handleGenerate} className="space-y-4 relative z-10">
              <p className="text-sm text-brand-muted text-center mb-6">
                Please enter your password to generate your unique 2FA secret.
              </p>
              <div>
                <label className="block text-sm font-bold text-white mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-brand-line rounded-lg p-3 text-white focus:border-brand-blue outline-none transition-colors"
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-brand-yellow text-black font-bold h-12 mt-4 rounded-xl hover:bg-brand-yellow/90">
                {loading ? "Generating..." : "Generate QR Code"}
              </Button>
            </form>
          ) : (
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-white p-4 rounded-xl mb-6">
                {/* We use a public API to generate a QR code image from the totpURI */}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(totpURI)}`} 
                  alt="QR Code" 
                  className="w-48 h-48"
                />
              </div>
              <p className="text-sm text-brand-muted text-center mb-6">
                Scan this QR code with Google Authenticator or Authy.
              </p>
              <Button onClick={() => router.push("/admin/signin")} className="w-full bg-brand-green text-black font-bold h-12 rounded-xl hover:bg-brand-green/90">
                I have scanned it, take me to login
              </Button>
            </div>
          )}
        </div>
      </div>
      <Footer hideCTA={true} />
    </div>
  );
}
