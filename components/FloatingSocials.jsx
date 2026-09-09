"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { FaInstagram, FaDiscord, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

export default function FloatingSocials() {
  const socialLinks = [
    { name: "LinkedIn", url: "https://www.linkedin.com/company/gdg-vitc/posts/?feedView=all", icon: FaLinkedin, color: "#0077b5" },
    { name: "Discord", url: "https://discord.com/invite/67G6bg4Xeq", icon: FaDiscord, color: "#5865F2" },
    { name: "Instagram", url: "https://www.instagram.com/gdg.vitc/", icon: FaInstagram, color: "#E1306C" },
    { name: "X", url: "https://x.com/gdg_vitc", icon: FaTwitter, color: "#1DA1F2" },
    { name: "Email", url: "mailto:gdgvitc@gmail.com", icon: FaEnvelope, color: "#EA4335" },
  ];

  const pathname = usePathname();
  if (pathname.startsWith("/admin") || pathname.startsWith("/departments")) {
    return null;
  }

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
      {socialLinks.map((social, idx) => {
        const Icon = social.icon;
        return (
          <motion.a
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + idx * 0.1, duration: 0.3 }}
            key={idx}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-brand-dark/80 backdrop-blur-md border border-brand-line flex items-center justify-center hover:bg-white hover:scale-110 transition-all group shadow-lg"
            aria-label={social.name}
          >
            <Icon 
              className="w-5 h-5 transition-colors" 
              style={{ color: social.color }} 
            />
          </motion.a>
        );
      })}
    </div>
  );
}
