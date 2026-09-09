// Font
import { Bricolage_Grotesque } from "next/font/google";
// Providers
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SubmissionsProvider } from "@/components/SubmissionsProvider";
import FloatingSocials from "@/components/FloatingSocials";
// Styling
import "./globals.css";

const bricolage = Bricolage_Grotesque({ 
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"]
});

export const metadata = {
  title: "GDG VITC | Recruitment Portal",
  description: "Recruitment portal for GDG VITC",
  icons: {
    icon: "/gdg-logo.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className={`${bricolage.className} antialiased bg-background text-foreground`}>
        <SubmissionsProvider>
          {children}
          <FloatingSocials />
          <Toaster />
        </SubmissionsProvider>
      </body>
    </html>
  );
}
