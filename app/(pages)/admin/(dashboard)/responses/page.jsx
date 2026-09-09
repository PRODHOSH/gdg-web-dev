import React from "react";
import { connect, serializeFirestoreData } from "@/lib/db";
import AdminContent from "@/components/AdminContent";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const db = await connect();
  const snapshot = await db.collection("formData").get();
  const applications = snapshot.docs.map((doc) => ({
    id: doc.id,
    _id: doc.id,
    ...serializeFirestoreData(doc.data()),
  }));

  // Group applications by unique Email
  const groupedApplicantsMap = new Map();
  
  applications.forEach(app => {
    if (!groupedApplicantsMap.has(app.Email)) {
      groupedApplicantsMap.set(app.Email, {
        Name: app.Name,
        RegistrationNumber: app.RegistrationNumber,
        Email: app.Email,
        Phone: app.Phone,
        Gender: app.Gender,
        "Why do you want to join Organization Name?": app["Why do you want to join Organization Name?"],
        applications: [],
        _id: app.Email, // Use email as unique row key
      });
    }
    groupedApplicantsMap.get(app.Email).applications.push(app);
  });

  const uniqueApplicants = Array.from(groupedApplicantsMap.values());

  return (
    <div className="flex-1 w-full max-w-[100vw] overflow-x-hidden p-6 h-full flex flex-col">
      <AdminContent applicants={uniqueApplicants} />
    </div>
  );
}
