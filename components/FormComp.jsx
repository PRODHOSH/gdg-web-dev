import React, { useEffect, useMemo, useState } from "react";
import * as z from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ChevronDown, Clock, Megaphone, UsersRound, X, AlertCircle } from "lucide-react";
import { QuestionnaireData } from "@/constants";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useSubmissions } from "@/components/SubmissionsProvider";

const normaliseQuestion = (question) => (
  typeof question === "string"
    ? { name: question, type: "generic", placeholder: "2-3 sentences" }
    : question
);

const FormComp = ({ dept1, dept2, isLoading, setIsLoading }) => {
  // Use Better Auth's useSession hook directly
  const { data: session, isPending, error } = authClient.useSession();
  
  const user = session?.user;
  const isSignedIn = !!user;
  const isLoaded = !isPending;

  // Form lifecycle and input telemetry state
  const [isFormOpen, setIsFormOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formScrollOffset, setFormScrollOffset] = useState(0);

  const router = useRouter();
  const { submittedDepartments: contextSubmitted, markDepartmentsSubmitted } = useSubmissions();
  const [submittedDepartments, setSubmittedDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDraftReady, setIsDraftReady] = useState(false);
  
  const departmentNames = useMemo(
    () => [dept1, dept2].filter(Boolean).map((department) => typeof department === "string" ? department : department.name),
    [dept1, dept2]
  );
  
  const draftKey = user?.email && departmentNames.length
    ? `recruitment-draft:${user.email}:${[...departmentNames].sort().join("|")}`
    : null;

  // Track scroll depth within form container
  useEffect(() => {
    const handleScroll = () => {
      setFormScrollOffset(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const normalizeDeptName = (str) => (str ? str.trim().toLowerCase().replace(/\s*\/\s*/g, "/") : "");

  const questionData = useMemo(
    () => [...new Set(departmentNames.flatMap((department) =>
      (QuestionnaireData.find((item) => normalizeDeptName(item.department) === normalizeDeptName(department))?.questions ?? [])
        .map(normaliseQuestion)
        .map((question) => question.name)
    ))],
    [departmentNames]
  );

  const schemaObj = {
    Name: z.string().min(1, "Name is required"),
    RegistrationNumber: z
      .string()
      .min(1, "Registration number is required")
      .regex(
        /^\d{2}[A-Z]{3}\d{4}$/,
        "Registration number must be 2 numbers, 3 uppercase letters, and 4 numbers (e.g. 25BCE5612)"
      ),
    Gender: z.string().min(1, "Gender is required"),
    Email: z.string(),
    Phone: z
      .string()
      .min(1, "Phone is required")
      .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    "Why do you want to join Organization Name?": z.string().min(1, "This field is required"),
  };

  questionData.forEach((qd) => {
    schemaObj[qd] = z.string().optional();
  });

  const formSchema = z.object(schemaObj);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      Name: "",
      RegistrationNumber: "",
      Gender: "",
      Email: "",
      Phone: "",
      "Why do you want to join Organization Name?": "",
    },
  });

  useEffect(() => {
    if (!isLoaded || !user || !draftKey) return;

    const email = user.email;
    let isActive = true;
    setIsDraftReady(false);

    try {
      const savedDraft = JSON.parse(localStorage.getItem(draftKey) || "{}");
      form.reset({ ...form.getValues(), ...savedDraft.values, Email: email });
    } catch {
      form.setValue("Email", email);
    }

    async function initialiseForm() {
      const savedDraft = JSON.parse(localStorage.getItem(draftKey) || "{}");
      let remoteSubmitted = contextSubmitted || [];

      if (!remoteSubmitted.length) {
        const cacheKey = `submitted_depts_${email}`;
        const cached = typeof window !== "undefined" ? sessionStorage.getItem(cacheKey) : null;

        if (cached) {
          try {
            remoteSubmitted = JSON.parse(cached);
          } catch {}
        } else {
          try {
            const response = await fetch(`/api/check-applications?email=${encodeURIComponent(email)}`);
            const result = await response.json();
            if (result?.submittedDepartments) {
              remoteSubmitted = result.submittedDepartments;
              if (typeof window !== "undefined") {
                sessionStorage.setItem(cacheKey, JSON.stringify(remoteSubmitted));
              }
            }
          } catch (err) {
            console.error("Failed to check applications:", err);
          }
        }
      }

      if (!isActive) return;
      const completed = [...new Set([...(savedDraft.submittedDepartments || []), ...remoteSubmitted])];
      setSubmittedDepartments(completed);
      if (departmentNames.length > 0 && departmentNames.every((dept) => completed.includes(dept))) {
        setErrorMessage(`You have already submitted an application for ${departmentNames.join(" and ")}.`);
      } else if (completed.length >= 2 && !departmentNames.some(d => completed.includes(d))) {
        setErrorMessage("You have already submitted the maximum allowed (2) applications.");
      }
      localStorage.setItem(draftKey, JSON.stringify({ values: form.getValues(), submittedDepartments: completed }));
      setLoading(false);
      if (setIsLoading) setIsLoading(false);
      setIsDraftReady(true);
    }

    initialiseForm().catch(() => {
      if (isActive) {
        setLoading(false);
        if (setIsLoading) setIsLoading(false);
        setIsDraftReady(true);
      }
    });

    return () => { isActive = false; };
  }, [contextSubmitted, departmentNames, draftKey, form, isLoaded, user, setIsLoading]);

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    if (!isDraftReady || !draftKey) return;
    localStorage.setItem(draftKey, JSON.stringify({ values: watchedValues, submittedDepartments }));
  }, [draftKey, isDraftReady, submittedDepartments, watchedValues]);

  // Check if user is authenticated
  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <span className="mx-auto mb-4 block h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="text-white">Loading your application...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] m-10">
        <div className="text-center max-w-md bg-brand-dark border border-brand-line p-8 rounded-2xl">
          <p className="text-2xl font-bold text-white mb-4">
            Sign In Required
          </p>
          <p className="text-brand-muted mb-8">
            Please sign in to access the application form.
          </p>
          <Button onClick={() => router.push("/auth/signin")} className="w-full bg-brand-yellow text-black hover:bg-brand-yellow/90 font-bold rounded-full">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (!isFormOpen) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] m-10">
        <div className="text-center max-w-md bg-brand-dark border border-brand-line p-8 rounded-2xl">
          <p className="text-2xl font-bold text-white mb-4">
            Recruitment Closed
          </p>
          <p className="text-brand-muted">
            The application window has now closed. Thank you for your interest!
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setErrorMessage("");

    const pendingDepartments = departmentNames.filter((department) => !submittedDepartments.includes(department));

    if (!pendingDepartments.length) {
      toast.success("Your applications have already been submitted.");
      setIsSubmitting(false);
      router.push("/departments");
      return;
    }

    const basicDetails = {
      Name: values.Name,
      RegistrationNumber: values.RegistrationNumber,
      Gender: values.Gender,
      Email: values.Email,
      Phone: values.Phone,
      "Why do you want to join Organization Name?": values["Why do you want to join Organization Name?"],
    };

    const submitDepartment = async (department) => {
      const questions = (QuestionnaireData.find((item) => item.department === department)?.questions ?? [])
        .map(normaliseQuestion);

      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...basicDetails,
          Department: department,
          Questions: questions.reduce((answers, question) => ({ ...answers, [question.name]: values[question.name] || "" }), {}),
        }),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Could not submit ${department}.`);
      }
      return { department, success: true };
    };

    try {
      const results = await Promise.allSettled(pendingDepartments.map(submitDepartment));
      const successful = results
        .filter((result) => result.status === "fulfilled" && result.value.success)
        .map((result) => result.value.department);
      const failed = results.flatMap((result, index) =>
        result.status === "rejected" ? [pendingDepartments[index]] : []
      );
      const completed = [...new Set([...submittedDepartments, ...successful])];

      setSubmittedDepartments(completed);
      markDepartmentsSubmitted(completed);
      if (draftKey) localStorage.setItem(draftKey, JSON.stringify({ values, submittedDepartments: completed }));
      if (typeof window !== "undefined" && values?.Email) {
        sessionStorage.setItem(`submitted_depts_${values.Email}`, JSON.stringify(completed));
      }
      successful.forEach((department) => toast.success(`Application submitted for ${department}.`));

      if (failed.length) {
        setErrorMessage(`Submitted ${successful.length ? successful.join(", ") : "no applications"}. Please retry ${failed.join(", ")}.`);
      } else {
        router.push("/departments");
      }
    } catch {
      setErrorMessage("Your applications could not be submitted. Your saved answers will be kept for retrying.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-6 py-12">
      {errorMessage && !isSubmitting && (
        <div className="mb-8 p-4 bg-brand-red/10 border border-brand-red/20 rounded-xl flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-brand-red font-medium mb-3">{errorMessage}</p>
            <Button variant="outline" onClick={() => router.push("/departments")} className="bg-transparent border-brand-red/50 text-brand-red hover:bg-brand-red/10">
              Back to Departments
            </Button>
          </div>
        </div>
      )}

      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Application Form</h1>
        <p className="text-brand-muted text-lg">
          Applying to: <strong className="text-white">{departmentNames.join(" & ")}</strong>
        </p>
      </div>

      <div className="bg-brand-dark/50 border border-brand-line rounded-3xl p-6 md:p-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-12">
            
            <section className="space-y-8">
              <div className="border-b border-brand-line pb-4">
                <h2 className="text-2xl font-bold text-white">About You</h2>
                <p className="text-brand-muted text-sm mt-1">Basic details for your application.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="Name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-brand-muted">Full Name</FormLabel>
                      <FormControl>
                        <Input className="bg-black/50 border-brand-line focus-visible:ring-brand-blue" {...field} placeholder="Jane Doe" />
                      </FormControl>
                      <FormMessage className="text-brand-red" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="RegistrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-brand-muted">Registration Number</FormLabel>
                      <FormControl>
                        <Input className="bg-black/50 border-brand-line focus-visible:ring-brand-blue" {...field} placeholder="e.g. 25BCE5612" />
                      </FormControl>
                      <FormMessage className="text-brand-red" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-brand-muted">Gender</FormLabel>
                      <FormControl>
                        <select 
                          className="flex h-10 w-full items-center justify-between rounded-md border border-brand-line bg-black/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-blue disabled:cursor-not-allowed disabled:opacity-50 text-white" 
                          {...field} 
                          value={field.value || ""}
                        >
                          <option value="" disabled className="bg-brand-dark">Select Gender</option>
                          <option value="Male" className="bg-brand-dark">Male</option>
                          <option value="Female" className="bg-brand-dark">Female</option>
                          <option value="Other" className="bg-brand-dark">Other</option>
                          <option value="Prefer not to say" className="bg-brand-dark">Prefer not to say</option>
                        </select>
                      </FormControl>
                      <FormMessage className="text-brand-red" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-brand-muted">Email Address</FormLabel>
                      <FormControl>
                        <Input className="bg-black/50 border-brand-line opacity-70 cursor-not-allowed" {...field} readOnly type="email" />
                      </FormControl>
                      <FormMessage className="text-brand-red" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="Phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-brand-muted">Phone (WhatsApp)</FormLabel>
                      <FormControl>
                        <Input className="bg-black/50 border-brand-line focus-visible:ring-brand-blue" {...field} placeholder="9876543210" />
                      </FormControl>
                      <FormMessage className="text-brand-red" />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4">
                <FormField
                  control={form.control}
                  name="Why do you want to join Organization Name?"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-brand-muted font-medium">Why do you want to join GDG VIT Chennai?</FormLabel>
                      <FormControl>
                        <Textarea className="bg-black/50 border-brand-line focus-visible:ring-brand-blue min-h-[100px] resize-y" {...field} placeholder="2-3 Sentences" />
                      </FormControl>
                      <FormMessage className="text-brand-red" />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {renderDepartmentQuestions(departmentNames[0], QuestionnaireData, form)}
            {departmentNames[1] && renderDepartmentQuestions(departmentNames[1], QuestionnaireData, form)}

            <div className="pt-8 border-t border-brand-line flex items-center justify-end gap-4">
              <Button type="button" variant="ghost" className="text-brand-muted hover:text-white" onClick={() => router.push("/departments")} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-brand-blue text-black font-bold px-8 hover:bg-brand-blue/90 rounded-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                  </>
                ) : "Submit Application"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

const renderDepartmentQuestions = (department, QuestionnaireData, form) => {
  const questions = (
    QuestionnaireData.find(qd => qd.department === department)?.questions ?? []
  )
    .map(normaliseQuestion)
    .filter((question) => question.name !== "Why do you want to join Organization Name?" && question.name !== "Why do you want to join DWASFW?");

  if (!questions.length) return null;

  return (
    <section className="space-y-8 pt-4">
      <div className="border-b border-brand-line pb-4">
        <h2 className="text-2xl font-bold text-white">{department}</h2>
        <p className="text-brand-muted text-sm mt-1">Specific questions for this role.</p>
      </div>
      
      <div className="space-y-6">
        {questions.map((question) => {
          const isCompact = question.type === "short-text";

          return (
            <FormField
              key={question.name}
              control={form.control}
              name={question.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-brand-muted leading-relaxed">{question.name}</FormLabel>
                  <FormControl>
                    {isCompact ? (
                      <Input
                        className="bg-black/50 border-brand-line focus-visible:ring-brand-blue"
                        {...field}
                        placeholder={question.placeholder || "Answer..."}
                      />
                    ) : (
                      <Textarea
                        className="bg-black/50 border-brand-line focus-visible:ring-brand-blue min-h-[100px] resize-y"
                        {...field}
                        placeholder={question.placeholder || "2-3 sentences"}
                      />
                    )}
                  </FormControl>
                  <FormMessage className="text-brand-red" />
                </FormItem>
              )}
            />
          );
        })}
      </div>
    </section>
  );
};

export default FormComp;
