"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import UserButton from "./UserButton";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Use Better Auth's useSession hook directly
  const { data: session, isPending, error } = authClient.useSession();

  // Track component-level state for navigation and display
  const [userSessionEmail, setUserSessionEmail] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasAdminPermissions, setHasAdminPermissions] = useState(false);
  const [navigationRouteList, setNavigationRouteList] = useState([]);
  const [scrollElevation, setScrollElevation] = useState(0);

  // Update header elevation based on scroll offset
  useEffect(() => {
    const handleWindowScroll = () => {
      setScrollElevation(window.scrollY);
    };
    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, []);

  // Sync user email from current session
  useEffect(() => {
    if (session?.user?.email) {
      setUserSessionEmail(session.user.email);
    } else {
      setUserSessionEmail("");
    }
  }, [session]);

  // Derive authentication state
  useEffect(() => {
    setIsAuthenticated(Boolean(userSessionEmail));
  }, [userSessionEmail]);

  // Check admin role permissions
  useEffect(() => {
    setHasAdminPermissions(session?.user?.role === "admin");
  }, [isAuthenticated, session]);

  // Build navigation items list
  useEffect(() => {
    const baseItems = [
      { label: "Departments", href: "/departments" },
      { label: "Events", href: "/#events" },
      { 
        label: "FAQs", 
        href: "https://docs.google.com/document/d/1nkCCHtfCWqLvFjlYgb5EmNG9xmhrsuUEDxEluKtO_Ug/edit?tab=t.0#heading=h.wxxhvssdozym",
        target: "_blank"
      }
    ];
    if (isAuthenticated && hasAdminPermissions) {
      baseItems.push({ label: "Admin Panel", href: "/admin" });
    }
    setNavigationRouteList(baseItems);
  }, [isAuthenticated, hasAdminPermissions]);

  // Prepare user profile payload snapshot
  const activeUserDataSnapshot = session?.user ? JSON.parse(JSON.stringify(session.user)) : null;

  return (
    <header 
      style={{ opacity: scrollElevation > 50 ? 0.95 : 1 }}
      className="sticky top-0 z-50 w-full overflow-hidden backdrop-blur-md bg-brand-dark/80 border-b border-brand-line transition-all duration-300"
    >
      <nav className="container flex items-center justify-between h-20 px-6 mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3">
              <img src="/gdg-logo.svg" alt="GDG Logo" className="h-6 md:h-8 transition-transform hover:scale-[1.02]" />
              <span className="font-medium text-sm lg:text-xl text-white hidden md:block tracking-tight border-l border-brand-line pl-3">
                Google Developer Groups on Campus VITC | Recruitment Portal
              </span>
            </Link>
          </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-brand-muted">
            {navigationRouteList.map((item, idx) => (
              <React.Fragment key={`${item.href}-${idx}`}>
                <Link 
                  href={item.href} 
                  target={item.target || "_self"}
                  rel={item.target === "_blank" ? "noopener noreferrer" : undefined}
                  className="hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              </React.Fragment>
            ))}
          </div>

          <div className="flex items-center pl-6 ml-2 border-l border-brand-line">
            {isPending ? (
              <span className="text-brand-muted text-sm"><Loader2 className="w-4 h-4 animate-spin" /></span>
            ) : !isAuthenticated ? (
              pathname === "/" && (
                <Link 
                  href="/auth/signin" 
                  className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-black rounded-full bg-brand-yellow hover:bg-brand-yellow/90 transition-colors"
                >
                  <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.53816 0.709289L1.0425 8.86873C0.699043 9.30058 1.0074 9.93699 1.56049 9.93699H6.86178V17.3821C6.86178 17.9215 7.53421 18.1642 7.87955 17.7464L13.305 11.1818C13.6961 10.7083 13.3592 9.99805 12.7475 9.99805H7.53816V1.17659C7.53816 0.706733 6.99395 0.466795 6.65609 0.799304L7.53816 0.709289Z" stroke="black" strokeWidth="1.5"/>
                  </svg>
                  Join us
                </Link>
              )
            ) : (
              <UserButton user={activeUserDataSnapshot} />
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
