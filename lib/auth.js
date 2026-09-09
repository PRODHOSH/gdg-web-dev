import { betterAuth } from "better-auth";
import { firestoreAdapter } from "better-auth-firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { nextCookies } from "better-auth/next-js";
import { admin, emailOTP } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey";
import nodemailer from "nodemailer";

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || "demo-DWASFW-rec";
const firebaseClientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

const appOptions = { projectId: firebaseProjectId };
if (firebaseClientEmail && firebasePrivateKey) {
  appOptions.credential = cert({
    projectId: firebaseProjectId,
    clientEmail: firebaseClientEmail,
    privateKey: firebasePrivateKey,
  });
}

const app = getApps().length > 0 ? getApps()[0] : initializeApp(appOptions);
export const firestore = getFirestore(app);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  trustedOrigins: [
    "http://localhost:3000",
    "https://gdg-webdev.vercel.app",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : [])
  ],
  database: firestoreAdapter({
    firestore,
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days (reduces re-login and session creation writes)
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // 1 day
    },
    updateAge: 60 * 60 * 24, // 1 day (prevent frequent session writes)
  },
  emailAndPassword: {
    enabled: false, // Disable password auth, we're using passwordless!
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      hd: "vitstudent.ac.in",
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Instead of env vars, query Firestore for whitelist
          const whitelistSnapshot = await firestore.collection("adminWhitelists").where("email", "==", user.email.toLowerCase()).get();
          const isAdmin = !whitelistSnapshot.empty;
          
          if (!user.email.endsWith("@vitstudent.ac.in") && !isAdmin) {
            return false; // Prevent creation of non-VIT and non-admin accounts
          }
          
          if (isAdmin) {
            return {
              data: {
                ...user,
                role: "admin",
              }
            };
          }
        },
      },
    },
  },
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const transporter = nodemailer.createTransport({
          service: 'gmail', // Standard configuration for Gmail
          auth: {
            user: process.env.EMAIL_USERNAME || process.env.SMTP_USER,
            pass: process.env.EMAIL_PASSWORD || process.env.SMTP_PASSWORD,
          },
        });
        await transporter.sendMail({
          from: `"GDG Admin" <${process.env.EMAIL_USERNAME || process.env.SMTP_USER}>`,
          to: email,
          subject: "Your GDG Admin Login Code",
          html: `<h1>GDG Admin Login</h1><p>Your one-time password is: <strong>${otp}</strong></p><p>This code will expire in a few minutes.</p>`,
        });
      }
    }),
    passkey(),
    nextCookies(),
  ],
});