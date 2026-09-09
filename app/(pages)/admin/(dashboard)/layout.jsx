"use client";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Megaphone, Video, BookOpen, MessageSquare, Settings, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  
  const [authStatus, setAuthStatus] = useState("pending");
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isPending) {
      if (!session?.user) {
        setAuthStatus("unauthenticated");
        router.push("/admin/signin");
      } else {
        setAuthStatus("authenticated");
        if (session.user.role === "admin") {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      }
    }
  }, [isPending, session, router]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/admin/signin");
  };

  if (isPending || authStatus === "pending") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
      </div>
    );
  }

  if (authStatus === "authenticated" && !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6 text-center">
        <div className="bg-brand-red/10 p-8 rounded-2xl border border-brand-red/30 max-w-md w-full">
          <h2 className="text-2xl font-bold text-brand-red mb-2">Access Denied</h2>
          <p className="text-brand-muted">You do not have the required administrator permissions.</p>
          <Button onClick={handleSignOut} variant="outline" className="mt-6 border-brand-red text-brand-red hover:bg-brand-red/10 w-full">
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  // Sidebar navigation links
  const navLinks = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard },
    { name: "Responses", path: "/admin/responses", icon: Users },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden text-white">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-brand-line bg-brand-dark flex flex-col hidden md:flex h-full">
        {/* Sidebar Header */}
        <div className="p-8 border-b border-brand-line">
          <div className="flex items-center gap-3 mb-2">
            <img src="/gdg-logo.svg" alt="GDG Logo" className="h-8" />
            <h2 className="text-2xl font-black text-white tracking-tight">Admin</h2>
          </div>
          <p className="text-xs font-bold text-brand-muted tracking-widest uppercase">Management Console</p>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navLinks.map((link, idx) => {
            const Icon = link.icon;
            const isActive = pathname === link.path;
            
            return (
              <Link 
                key={idx} 
                href={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  isActive 
                  ? "bg-white/5 text-white border border-brand-line/50" 
                  : "text-brand-muted hover:text-white hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-brand-muted'}`} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-brand-line">
          <div className="bg-white/5 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center shrink-0">
                <span className="text-brand-blue font-bold text-sm">
                  {session?.user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{session?.user?.name || "Admin"}</p>
                <p className="text-xs text-brand-muted truncate">{session?.user?.email}</p>
              </div>
            </div>
            <button 
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-brand-red/10 text-brand-red text-sm font-bold hover:bg-brand-red/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#0a0a0a]">
        {children}
      </main>

    </div>
  );
}
