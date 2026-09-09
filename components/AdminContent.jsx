"use client";
import React from "react";
import DataTable from "./DataTable";

const AdminContent = ({ applicants }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Applications</h1>
        <p className="text-brand-muted">View, filter, and shortlist candidates.</p>
      </div>
      <DataTable data={applicants} />
    </div>
  );
};

export default AdminContent;
