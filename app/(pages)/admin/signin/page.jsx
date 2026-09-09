"use client";
import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function AdminSignIn() {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // login, otp
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  React.useEffect(() => {
    if (!isPending && session?.user?.role === "admin") {
      router.push("/admin");
    }
  }, [session, isPending, router]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Request OTP via Better Auth emailOTP plugin
    const { data, error } = await authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" });

    if (error) {
      toast.error(error.message || "Failed to send OTP. Are you whitelisted?");
    } else {
      toast.success("OTP sent to your email!");
      setMode("otp");
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Verify OTP
    const { data, error } = await authClient.signIn.emailOtp({
      email,
      otp: otpCode,
    });

    if (error) {
      toast.error(error.message || "Invalid OTP or unauthorized");
    } else if (data) {
      toast.success("Signed in successfully!");
      router.push("/admin");
    }
    setLoading(false);
  };

  const handlePasskeyLogin = async () => {
    setLoading(true);
    const { data, error } = await authClient.signIn.passkey({});
    if (error) {
      toast.error(error.message || "Passkey login failed");
    } else {
      toast.success("Signed in with Passkey!");
      router.push("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-brand-dark/80 p-8 rounded-2xl border border-brand-line max-w-md w-full shadow-2xl relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-red/20 rounded-full blur-[50px] pointer-events-none"></div>
          
          <div className="flex justify-center mb-6 relative z-10">
            <img src="/gdg-logo.svg" alt="GDG Logo" className="h-10" />
          </div>
          
          <h2 className="text-3xl font-black text-white mb-2 text-center relative z-10">Admin Access</h2>
          <p className="text-brand-muted mb-8 text-center relative z-10">Passwordless Secure Login</p>
          
          {isPending ? (
            <div className="flex justify-center p-8 relative z-10">
              <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : mode === "otp" ? (
            <form onSubmit={handleVerifyOTP} className="space-y-4 relative z-10">
              <p className="text-sm text-brand-muted text-center mb-4">We've sent a code to <br/><span className="text-white font-bold">{email}</span></p>
              <div>
                <label className="block text-sm font-bold text-white mb-2 text-center">Enter OTP</label>
                <input 
                  type="text" 
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full bg-black/50 border border-brand-line rounded-lg p-4 text-white text-center tracking-[0.5em] text-2xl font-mono focus:border-brand-blue outline-none transition-colors"
                  required
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-brand-green text-black font-bold h-12 mt-4 rounded-xl hover:bg-brand-green/90 border-none">
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
              <button type="button" onClick={() => setMode("login")} className="w-full text-brand-muted text-sm mt-4 hover:text-white transition-colors">
                Change Email
              </button>
            </form>
          ) : (
            <div className="relative z-10">
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-white mb-1">Admin Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 border border-brand-line rounded-lg p-3 text-white focus:border-brand-blue outline-none transition-colors"
                    placeholder="name@vitstudent.ac.in"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-brand-yellow text-black font-bold h-12 mt-4 rounded-xl hover:bg-brand-yellow/90 border-none">
                  {loading ? "Processing..." : "Send Login Code"}
                </Button>
                
                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-brand-line"></div>
                  <span className="flex-shrink-0 mx-4 text-brand-muted text-sm font-medium">OR</span>
                  <div className="flex-grow border-t border-brand-line"></div>
                </div>

                <Button 
                  type="button" 
                  onClick={handlePasskeyLogin} 
                  disabled={loading} 
                  className="w-full bg-brand-green/10 text-brand-green font-bold h-12 rounded-xl hover:bg-brand-green/20 border-none flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" y1="16" x2="6.01" y2="16"/><line x1="10" y1="16" x2="10.01" y2="16"/></svg>
                  Sign in with Passkey
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer hideCTA={true} />
    </div>
  );
}
