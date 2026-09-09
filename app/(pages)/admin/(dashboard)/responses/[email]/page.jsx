import React from "react";
import { connect, serializeFirestoreData } from "@/lib/db";
import ResponseDetailClient from "./ResponseDetailClient";

export const dynamic = "force-dynamic";

export default async function ApplicantResponsePage({ params }) {
  const email = decodeURIComponent(params.email);
  const db = await connect();
  
  // Fetch all applications for this user
  const snapshot = await db.collection("formData").where("Email", "==", email).get();
  
  if (snapshot.empty) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center mt-20">
        <h1 className="text-3xl font-bold text-white mb-2">Applicant not found</h1>
        <p className="text-brand-muted">No applications found for {email}</p>
      </div>
    );
  }

  const applications = snapshot.docs.map((doc) => ({
    id: doc.id,
    _id: doc.id,
    ...serializeFirestoreData(doc.data()),
  }));

  return (
    <div className="p-8 max-w-5xl mx-auto w-full">
      <ResponseDetailClient applications={applications} email={email} />
    </div>
  );
}
