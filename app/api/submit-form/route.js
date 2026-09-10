import { connect } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      return new Response(
        JSON.stringify({ message: "Authentication required" }),
        { status: 401 }
      );
    }

    const user = session.user;
    const userEmail = user.email;

    const deadline = new Date("2026-08-23T23:59:59+05:30");
    if (new Date() > deadline)
      return new Response(
        JSON.stringify({
          message: "The submission deadline has passed"
        }),
        { status: 403 }
      );
                  

    const db = await connect();
    const data = await req.json();

    const { Department, Questions, ...formFields } = data;

    const regNoRegex = /^\d{2}[A-Z]{3}\d{4}$/;
    if (formFields.RegistrationNumber && !regNoRegex.test(formFields.RegistrationNumber)) {
      return new Response(
        JSON.stringify({
          message: "Registration number must be 2 numbers, 3 uppercase letters, and 4 numbers (e.g. 25BCE5612)",
        }),
        { status: 400 }
      );
    }

    const collection = db.collection("formData");

    // Check existing submissions by both Email and RegistrationNumber
    const existingSubmissionsEmail = await collection.where("Email", "==", userEmail).get();
    const existingSubmissionsReg = await collection.where("RegistrationNumber", "==", formFields.RegistrationNumber).get();

    const alreadySubmittedDeptEmail = existingSubmissionsEmail.docs.some((doc) => doc.data()?.Department === Department);
    const alreadySubmittedDeptReg = existingSubmissionsReg.docs.some((doc) => doc.data()?.Department === Department);

    if (alreadySubmittedDeptEmail || alreadySubmittedDeptReg) {
      return new Response(
        JSON.stringify({
          message: `You have already submitted an application for ${Department}`,
        }),
        { status: 400 }
      );
    }

    const totalApplications = new Set([
      ...existingSubmissionsEmail.docs.map(d => d.data().Department),
      ...existingSubmissionsReg.docs.map(d => d.data().Department)
    ]);

    if (totalApplications.size >= 2) {
      return new Response(
        JSON.stringify({
          message: "You have reached the maximum limit of 2 unique department applications.",
        }),
        { status: 400 }
      );
    }

    // Fix: Use deterministic document ID to prevent duplicates via race conditions and improve identification
    const safeDept = Department.replace(/[^a-zA-Z0-9]/g, '_');
    const docId = `${userEmail}_${safeDept}`;

    await collection.doc(docId).set({
      ...formFields,
      Department,
      Questions,
      Email: userEmail,
      createdAt: new Date(),
    });

    return new Response(
      JSON.stringify({
        message: "Form submitted successfully!",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Form submission error:", error);
    return new Response(JSON.stringify({ message: "Error submitting form" }), {
      status: 500,
    });
  }
}
