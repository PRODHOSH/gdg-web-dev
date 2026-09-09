"use client";
import React, { useState } from "react";
import { ArrowLeft, User, Phone, Mail, Building, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ResponseDetailClient({ applications, email }) {
  const [apps, setApps] = useState(applications);
  const applicant = apps[0]; // Common details (Name, RegNo, Phone) are the same across all their applications

  const handleShortlistToggle = async (id, currentStatus, deptName) => {
    try {
      const res = await fetch(`/api/shortlist/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shortlisted: !currentStatus }),
      });

      if (res.ok) {
        setApps(prev => prev.map(a => 
          a._id === id ? { ...a, shortlisted: !currentStatus } : a
        ));
        toast.success(`${applicant.Name} ${!currentStatus ? 'shortlisted' : 'un-shortlisted'} for ${deptName}!`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Navigation */}
      <div className="flex items-center justify-between border-b border-brand-line pb-6">
        <div>
          <Link href="/admin/responses" className="inline-flex items-center gap-2 text-brand-muted hover:text-white transition-colors mb-4 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Back to Responses
          </Link>
          <h1 className="text-3xl font-black text-white capitalize">{applicant.Name}</h1>
          <p className="text-brand-muted mt-1 uppercase tracking-widest text-xs font-bold">{applicant.RegistrationNumber}</p>
        </div>
      </div>

      {/* General Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1a1a1a] rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-blue/10 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-brand-blue" />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-1">Email</p>
            <p className="text-sm text-white font-medium truncate">{applicant.Email}</p>
          </div>
        </div>
        
        <div className="bg-[#1a1a1a] rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-yellow/10 flex items-center justify-center shrink-0">
            <Phone className="w-5 h-5 text-brand-yellow" />
          </div>
          <div>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-1">Phone</p>
            <p className="text-sm text-white font-medium">{applicant.Phone}</p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-brand-green" />
          </div>
          <div>
            <p className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-1">Gender</p>
            <p className="text-sm text-white font-medium">{applicant.Gender}</p>
          </div>
        </div>
      </div>

      {/* Core Question */}
      <div className="bg-[#1a1a1a] rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Building className="w-32 h-32 text-white" />
        </div>
        <h3 className="text-brand-muted text-xs font-bold tracking-widest uppercase mb-4 relative z-10">Why join GDG?</h3>
        <p className="text-lg text-white font-medium leading-relaxed relative z-10">
          "{applicant["Why do you want to join Organization Name?"] || "No response provided."}"
        </p>
      </div>

      {/* Department Applications */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white mb-6">Department Applications ({apps.length})</h2>
        
        {apps.map((app, idx) => (
          <div key={app._id} className="bg-[#1a1a1a] rounded-2xl overflow-hidden group transition-colors">
            
            {/* Dept Header */}
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-xs font-bold text-white shrink-0">
                  #{app.Pref || idx + 1}
                </div>
                <h3 className="text-xl font-bold text-white">{app.Department}</h3>
                {app.shortlisted && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-green/10 text-brand-green text-xs font-bold border border-brand-green/20">
                    <CheckCircle className="w-3 h-3" /> Shortlisted
                  </span>
                )}
              </div>
              <Button 
                onClick={() => handleShortlistToggle(app._id, app.shortlisted, app.Department)}
                className={`font-bold transition-all border-none ${
                  app.shortlisted 
                  ? "bg-brand-red/10 text-brand-red hover:bg-brand-red/20" 
                  : "bg-brand-green/10 text-brand-green hover:bg-brand-green/20"
                }`}
                variant="outline"
              >
                {app.shortlisted ? "Revoke Shortlist" : "Shortlist for " + app.Department}
              </Button>
            </div>

            {/* Dept Responses */}
            <div className="p-6 space-y-6">
              {app.Questions && Object.keys(app.Questions).length > 0 ? (
                Object.entries(app.Questions).map(([q, a], qIdx) => (
                  <div key={qIdx} className="bg-black/40 p-5 rounded-xl">
                    <p className="text-brand-blue font-medium mb-2 text-sm leading-relaxed">{q}</p>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{a || "No response provided."}</p>
                  </div>
                ))
              ) : (
                <p className="text-brand-muted text-sm italic py-4">No specific questions for this department.</p>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
