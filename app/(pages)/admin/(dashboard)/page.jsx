import React from "react";
import { connect, serializeFirestoreData } from "@/lib/db";
import { Users, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const db = await connect();
  const snapshot = await db.collection("formData").get();
  const applicants = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...serializeFirestoreData(doc.data()),
  }));

  const totalApplicants = applicants.length;
  const shortlistedCount = applicants.filter(a => a.shortlisted).length;
  const pendingCount = totalApplicants - shortlistedCount;

  // Calculate department breakdown
  const deptCounts = applicants.reduce((acc, curr) => {
    const dept = curr.Department;
    if (dept) {
      acc[dept] = (acc[dept] || 0) + 1;
    }
    return acc;
  }, {});

  const topDepartments = Object.entries(deptCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tight uppercase">DIRECTORY</h1>
          <p className="text-brand-muted text-sm mt-1">Search, edit, and manage applications cleanly.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 rounded-lg bg-white/5 border border-brand-line/50 text-sm font-medium text-white hover:bg-white/10 transition-colors">
            All Roles
          </button>
          <button className="px-4 py-2 rounded-lg bg-white/5 border border-brand-line/50 text-sm font-medium text-white hover:bg-white/10 transition-colors">
            All Status
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-brand-dark rounded-2xl p-6 relative overflow-hidden group transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-24 h-24 text-brand-blue" />
          </div>
          <p className="text-brand-muted text-xs font-bold tracking-widest uppercase mb-2">Total Applicants</p>
          <p className="text-5xl font-black text-white">{totalApplicants}</p>
        </div>
        
        <div className="bg-brand-dark rounded-2xl p-6 relative overflow-hidden group transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 className="w-24 h-24 text-brand-green" />
          </div>
          <p className="text-brand-muted text-xs font-bold tracking-widest uppercase mb-2">Shortlisted</p>
          <p className="text-5xl font-black text-white">{shortlistedCount}</p>
        </div>

        <div className="bg-brand-dark rounded-2xl p-6 relative overflow-hidden group transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <AlertCircle className="w-24 h-24 text-brand-yellow" />
          </div>
          <p className="text-brand-muted text-xs font-bold tracking-widest uppercase mb-2">Pending Review</p>
          <p className="text-5xl font-black text-white">{pendingCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Department Breakdown */}
        <div className="bg-brand-dark rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-blue" />
            Top Departments
          </h2>
          <div className="space-y-4">
            {topDepartments.length > 0 ? topDepartments.map(([dept, count], idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <span className="font-medium text-gray-300">{dept}</span>
                <span className="bg-white/10 text-white px-3 py-1 rounded-full text-sm font-bold">{count}</span>
              </div>
            )) : (
              <p className="text-brand-muted text-sm">No applications found.</p>
            )}
          </div>
        </div>
        
        {/* Recent Activity placeholder */}
        <div className="bg-brand-dark rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-6">Recent Activity</h2>
          <div className="flex flex-col items-center justify-center h-48 text-brand-muted text-sm bg-white/5 rounded-xl">
            <p>Activity logs will appear here</p>
          </div>
        </div>
      </div>

    </div>
  );
}
