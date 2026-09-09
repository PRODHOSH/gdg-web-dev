"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import DWASFWLoader from "@/components/GDGLoader";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (session?.user && !isPending) {
      router.push("/departments");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center">
        <DWASFWLoader />
      </div>
    );
  }

  if (session?.user) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <p className="text-sm text-brand-muted">Redirecting to portal...</p>
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/departments",
      });
    } catch (err) {
      toast.error("Failed to sign in with Google.");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (mode === "signup" && !name) {
      toast.error("Please enter your name.");
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "signup") {
        const res = await authClient.signUp.email({
          email,
          password,
          name,
          callbackURL: "/departments",
        });
        if (res?.error) {
          toast.error(res.error.message || "Failed to create account.");
        } else {
          toast.success("Account created successfully!");
          router.push("/departments");
        }
      } else {
        const res = await authClient.signIn.email({
          email,
          password,
          callbackURL: "/departments",
        });
        if (res?.error) {
          toast.error(res.error.message || "Invalid credentials.");
        } else {
          toast.success("Signed in successfully!");
          router.push("/departments");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      toast.error("Authentication failed. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-red/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      
      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-8 gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/")} 
            className="self-start text-brand-muted hover:text-white hover:bg-white/10 -ml-4"
          >
            &larr; Back to Home
          </Button>
          <img src="/gdg-logo.svg" alt="GDG Logo" className="h-8" />
        </div>
        
        <Card className="bg-brand-dark/80 backdrop-blur-md border-brand-line shadow-2xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-extrabold text-white">
              {mode === "signin" ? "Welcome back" : "Create an account"}
            </CardTitle>
            <CardDescription className="text-brand-muted">
              {mode === "signin" 
                ? "Enter your credentials to access the recruitment portal" 
                : "Sign up to begin your application process"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Button 
              variant="outline" 
              className="w-full bg-white text-black hover:bg-gray-100 border-none font-semibold h-11"
              onClick={handleGoogleSignIn}
              disabled={googleLoading || submitting}
            >
              {googleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <FcGoogle className="w-5 h-5 mr-2" />
              )}
              Continue with @vitstudent.ac.in
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-brand-line" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-brand-dark px-2 text-brand-muted">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-brand-dark/50 border-brand-line text-white h-11 focus-visible:ring-brand-blue"
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-300">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-brand-dark/50 border-brand-line text-white h-11 focus-visible:ring-brand-blue"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-brand-dark/50 border-brand-line text-white h-11 focus-visible:ring-brand-blue"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={submitting || googleLoading}
                className="w-full bg-brand-yellow text-black hover:bg-brand-yellow/90 font-bold h-11 mt-2"
              >
                {submitting 
                  ? <Loader2 className="w-5 h-5 animate-spin" /> 
                  : mode === "signin" ? "Sign In" : "Create Account"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center border-t border-brand-line pt-6 pb-6">
            <p className="text-sm text-brand-muted">
              {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-brand-blue hover:underline font-semibold"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
