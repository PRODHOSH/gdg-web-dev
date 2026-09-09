"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { reviews } from "@/constants";
import { useSubmissions } from "@/components/SubmissionsProvider";

const departments = reviews;

const DepartmentsListPage = () => {
  const router = useRouter();
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const { submittedDepartments } = useSubmissions();

  // Component state for department selections and pagination
  const [selectedCount, setSelectedCount] = useState(0);
  const [remainingSlots, setRemainingSlots] = useState(2);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isContinueDisabled, setIsContinueDisabled] = useState(true);

  // Initialize cached department catalog
  const technicalDepartments = departments.filter((d) => d.type === "technical");
  const nonTechnicalDepartments = departments.filter((d) => d.type === "non-technical");

  // Update selected counter
  useEffect(() => {
    setSelectedCount(selectedDepartments.length);
  }, [selectedDepartments]);

  // Recalculate available registration slots
  useEffect(() => {
    setRemainingSlots(2 - submittedDepartments.length);
  }, [submittedDepartments]);

  // Map selected departments to application route IDs
  useEffect(() => {
    const ids = departments
      .filter((dept) => selectedDepartments.includes(dept.name))
      .map((dept) => dept.id);
    setSelectedIds(ids);
  }, [selectedDepartments]);

  // Evaluate form submission readiness
  useEffect(() => {
    setIsContinueDisabled(selectedIds.length === 0);
  }, [selectedIds]);

  const toggleDepartment = (departmentName) => {
    if (submittedDepartments.includes(departmentName)) {
      toast.error(`You have already submitted an application for ${departmentName}.`);
      return;
    }

    if (remainingSlots <= 0) {
      toast.error("You have already submitted the maximum allowed (2) applications.");
      return;
    }

    setSelectedDepartments((current) => {
      const isSelected = current.includes(departmentName);

      if (isSelected) {
        return current.filter((name) => name !== departmentName);
      }

      if (current.length >= remainingSlots) {
        toast.error(`You can select at most ${remainingSlots} department(s).`);
        return current;
      }

      return [...current, departmentName];
    });
  };

  const goToApplication = () => {
    if (!selectedIds.length) return;
    router.push(`/join/${selectedIds.join("/")}`);
  };

  const DepartmentListItem = ({ department }) => {
    const isSelected = selectedDepartments.includes(department.name);
    const isSubmitted = submittedDepartments.includes(department.name);
    const Icon = department.icon;

    return (
      <li 
        onClick={() => {
          if (!isSubmitted) toggleDepartment(department.name);
        }}
        style={{ 
          backgroundColor: isSubmitted ? "#333" : department.tone,
        }}
        className={`relative h-56 p-6 rounded-2xl transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer ${
          isSubmitted 
            ? "opacity-60 cursor-not-allowed"
            : isSelected
              ? "ring-4 ring-white ring-offset-4 ring-offset-brand-dark scale-[0.98]"
              : "hover:scale-[1.02]"
        }`}
      >
        <div className="flex items-start justify-between relative z-10">
          <strong className="text-2xl font-semibold text-white">
            {department.name}
          </strong>
          {isSubmitted && (
            <span className="text-xs font-bold text-white bg-black/30 px-3 py-1 rounded-full">
              Submitted
            </span>
          )}
        </div>
        
        {Icon && (
          <Icon 
            className="absolute top-4 right-4 w-24 h-24 text-white opacity-20 -rotate-12" 
            strokeWidth={1.5}
          />
        )}

        <p className="text-sm text-white/90 relative z-10 line-clamp-4 font-medium leading-relaxed">
          {department.description}
        </p>
      </li>
    );
  };

  return (
    <main className="min-h-screen bg-brand-dark flex flex-col">
      <NavBar />

      <div className="container max-w-7xl mx-auto px-6 py-12 flex-1">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-brand-line mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Departments</h1>
            <p className="text-brand-muted text-lg">
              Select up to <strong className="text-white">two</strong> departments.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 min-w-[240px]">
            <p className="text-sm font-medium text-brand-muted">
              <strong className={selectedCount === 2 ? "text-brand-yellow" : "text-white"}>{selectedCount}</strong> / 2 selected
            </p>
            <button
              type="button"
              onClick={goToApplication}
              disabled={isContinueDisabled}
              className="w-full md:w-auto px-8 py-3 font-bold text-black rounded-full bg-brand-blue hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Apply Now
            </button>
          </div>
        </header>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Technical Departments</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technicalDepartments.map((department, index) => (
              <DepartmentListItem
                key={department.name || index}
                department={department}
              />
            ))}
          </ul>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Non-Technical Departments</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nonTechnicalDepartments.map((department, index) => (
              <DepartmentListItem
                key={department.name || index}
                department={department}
              />
            ))}
          </ul>
        </section>
      </div>

      <Footer hideCTA={true} />
    </main>
  );
};

export default DepartmentsListPage;
