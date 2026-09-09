"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaInstagram, FaDiscord, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import { Button } from "./ui/button";

const Footer = ({ hideCTA = false }) => {
  const [currentYear, setCurrentYear] = useState("2026");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  const socialLinks = [
    { name: "LinkedIn", url: "https://www.linkedin.com/company/gdg-vitc/posts/?feedView=all", icon: FaLinkedin, color: "#0077b5" },
    { name: "Discord", url: "https://discord.com/invite/67G6bg4Xeq", icon: FaDiscord, color: "#5865F2" },
    { name: "Instagram", url: "https://www.instagram.com/gdg.vitc/", icon: FaInstagram, color: "#E1306C" },
    { name: "X", url: "https://x.com/gdg_vitc", icon: FaTwitter, color: "#1DA1F2" },
    { name: "Email", url: "mailto:gdgvitc@gmail.com", icon: FaEnvelope, color: "#EA4335" },
  ];

  const internalLinks = [
    { name: "Home", path: "/" },
    { name: "Departments", path: "/departments" },
    { name: "Events", path: "/#events" },
  ];

  return (
    <footer className="relative bg-brand-dark overflow-hidden z-10 pt-24 border-t border-brand-line mt-24">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl px-6 pb-12 relative z-10">
        {/* Large CTA Section */}
        {!hideCTA && (
          <div className="flex flex-col items-center justify-center text-center mb-24 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              Ready to <span className="text-brand-blue">build</span> the future?
            </h2>
            <p className="text-brand-muted text-lg md:text-xl mb-10 max-w-2xl">
              Join a community of developers, designers, and innovators at VIT Chennai. Take the first step towards building something extraordinary.
            </p>
            <Button asChild className="h-14 px-10 rounded-full bg-white text-black hover:bg-gray-200 font-bold text-lg">
              <Link href="/auth/signin">
                Apply Now
              </Link>
            </Button>
          </div>
        )}

        {/* Footer Links & Info */}
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-12 border-brand-line pt-12 pb-8 ${hideCTA ? '' : 'border-t'}`}>
          
          {/* Logo & Description (Left) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <img src="/gdg-logo.svg" alt="GDG VIT Chennai" className="h-8 object-contain self-start" />
            <p className="text-brand-muted max-w-sm text-lg leading-relaxed">
              Google Developer Groups VIT Chennai is a community of students passionate about technology and innovation.
            </p>
            
            <div className="flex items-center gap-5 mt-2">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a 
                    key={idx} 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center transition-transform hover:-translate-y-1 hover:scale-110 drop-shadow-sm"
                    aria-label={social.name}
                  >
                    <Icon className="w-7 h-7" style={{ color: social.color }} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 md:col-start-7 flex flex-col gap-4">
            <h4 className="text-white font-bold mb-2">Explore</h4>
            <ul className="flex flex-col gap-3">
              {internalLinks.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.path} className="text-brand-muted hover:text-brand-blue transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="text-white font-bold mb-2">Contact</h4>
            <p className="text-brand-muted text-sm leading-relaxed">
              Vellore Institute of Technology, Chennai<br/>
              Kelambakkam - Vandalur Rd, Chennai, Tamil Nadu 600127
            </p>
            <a href="mailto:gdgvitc@gmail.com" className="text-brand-yellow font-medium hover:underline mt-2">
              gdgvitc@gmail.com
            </a>
          </div>

        </div>

        {/* Copyright Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-brand-line/50 text-sm text-brand-muted/70">
          <p>&copy; {currentYear} GDG VIT Chennai. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
