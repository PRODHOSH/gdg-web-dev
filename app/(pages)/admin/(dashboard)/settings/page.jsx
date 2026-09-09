"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2, UserPlus, Shield, Loader2, Fingerprint } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function SettingsPage() {
  const { data: session } = authClient.useSession();
  const [whitelists, setWhitelists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  
  const [passkeyAdded, setPasskeyAdded] = useState(false);

  useEffect(() => {
    fetchWhitelists();
  }, []);

  const fetchWhitelists = async () => {
    try {
      const res = await fetch("/api/admin/whitelist");
      if (res.ok) {
        const data = await res.json();
        setWhitelists(data.whitelists);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load admin whitelists");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (!newEmail) return;
    
    // Parse comma or newline separated emails
    const emails = newEmail.split(/[\n,]+/).map(e => e.trim()).filter(e => e);
    if (emails.length === 0) return;

    let added = 0;
    let failed = 0;

    for (const email of emails) {
      try {
        const res = await fetch("/api/admin/whitelist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
        
        if (res.ok) added++;
        else failed++;
      } catch (error) {
        failed++;
      }
    }

    if (added > 0) toast.success(`Added ${added} admin(s)`);
    if (failed > 0) toast.error(`Failed to add ${failed} admin(s). They might already exist.`);
    
    setNewEmail("");
    fetchWhitelists();
  };

  const handleRemoveAdmin = async (id) => {
    if (!confirm("Are you sure you want to remove this admin?")) return;

    try {
      const res = await fetch("/api/admin/whitelist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        toast.success("Admin removed");
        fetchWhitelists();
      } else {
        toast.error("Failed to remove admin");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleAddPasskey = async () => {
    try {
      const { data, error } = await authClient.passkey.addPasskey({});
      if (error) {
        toast.error(error.message || "Failed to add passkey");
      } else {
        setPasskeyAdded(true);
        toast.success("Passkey registered successfully! You can now log in with it.");
      }
    } catch (err) {
      toast.error("Failed to add passkey");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-black text-white">Settings</h1>
        <p className="text-brand-muted mt-2">Manage administrators and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Whitelist Management */}
        <div className="space-y-6">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-brand-blue" />
              <h2 className="text-xl font-bold text-white">Admin Whitelist</h2>
            </div>
            
            <form onSubmit={handleAddAdmin} className="flex flex-col gap-3 mb-6">
              <textarea 
                placeholder="Enter admin emails separated by commas or new lines..."
                className="w-full bg-black/40 border-none rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-brand-blue min-h-[100px] resize-y"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
              <Button type="submit" className="bg-brand-blue/10 text-brand-blue hover:bg-brand-blue hover:text-black font-bold border-none w-full">
                <UserPlus className="w-4 h-4 mr-2" /> Add Admins
              </Button>
            </form>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-brand-muted" /></div>
              ) : whitelists.length > 0 ? (
                whitelists.map(admin => (
                  <div key={admin.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl group">
                    <span className="text-white text-sm font-medium">{admin.email}</span>
                    <button 
                      onClick={() => handleRemoveAdmin(admin.id)}
                      className="text-brand-muted hover:text-brand-red transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-brand-muted text-sm text-center py-4">No whitelisted admins found.</p>
              )}
            </div>
          </div>
        </div>

        {/* Security / Passkey */}
        <div className="space-y-6">
          <div className="bg-[#1a1a1a] p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Fingerprint className="w-5 h-5 text-brand-green" />
              <h2 className="text-xl font-bold text-white">Biometric Login (Passkeys)</h2>
            </div>
            
            <div className="bg-white/5 rounded-xl p-6">
              {passkeyAdded ? (
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <Shield className="w-12 h-12 text-brand-green mb-2" />
                  <div>
                    <h3 className="text-lg font-bold text-white">Passkey Registered</h3>
                    <p className="text-brand-muted text-sm mt-1">You can now use Touch ID, Face ID, or Windows Hello to log in instantly.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <p className="text-gray-300 text-sm">
                    Skip the Email OTP and log in instantly using your device's built-in biometric sensor (Fingerprint, FaceID, or Windows Hello).
                  </p>
                  <Button onClick={handleAddPasskey} className="bg-brand-green/10 text-brand-green hover:bg-brand-green/20 font-bold border-none">
                    Register New Passkey
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
