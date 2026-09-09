"use client";
import React, { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import PopupComp from "@/components/PopupComp";
import { authClient } from "@/lib/auth-client";
import { reviews } from "@/constants";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaLaptopCode, FaUserFriends, FaGlobeAmericas } from "react-icons/fa";

export default function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [activeSessionSnapshot, setActiveSessionSnapshot] = useState(null);
  const { data: session, isPending } = authClient.useSession();

  // Keep session snapshot synchronized
  useEffect(() => {
    if (session) {
      setActiveSessionSnapshot(JSON.parse(JSON.stringify(session)));
    }
  }, [session]);

  const user = activeSessionSnapshot?.user || session?.user;

  const popupConfig = {
    header: "Recruitment Notice",
    description: "Welcome to the recruitment portal.",
    message: [
      "Sign in with your email address to begin your application.",
      "You can apply to up to two departments.",
    ],
  };

  const technicalDepartments = reviews.filter((d) => d.type === "technical");
  const nonTechnicalDepartments = reviews.filter((d) => d.type === "non-technical");

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Ambient background glowing orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-green/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-brand-blue/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-brand-red/15 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
      
      <div className="relative z-10 flex flex-col flex-1">
        <NavBar />
        {!isPending && !user && (
          <PopupComp
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            PopupData={popupConfig}
          />
        )}
        
        {/* Custom Hero Section */}
        <section className="relative w-full max-w-6xl mx-auto px-4 pt-4 pb-4 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          {/* Top Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 px-4 py-2 rounded-full border border-brand-line bg-brand-dark/50 backdrop-blur-sm flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-brand-green"></span>
            <span className="text-sm font-medium text-brand-muted">Student Dev Community · backed by Google Developers</span>
          </motion.div>

          {/* Headline */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative text-center z-10 mb-6 max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] text-white">
              join the <span className="text-brand-blue">builders</span>, <br />
              shape the <span className="text-brand-red">future</span> <br />
              <span className="relative inline-block">
                today
                {/* Yellow Squiggle SVG under 'today' */}
                <svg className="absolute w-[110%] h-auto left-1/2 -translate-x-1/2 -bottom-4 text-brand-yellow" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 15.5C35 -5.5 70 15.5 100 15.5C130 15.5 165 -5.5 198 15.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>
            </h1>

            {/* Floating Elements */}
            <div className="absolute -top-10 -left-12 text-brand-yellow text-2xl hidden md:block">✦</div>
            <div className="absolute top-20 -left-20 hidden md:block">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-blue">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            
            {/* Beginner Friendly Pill */}
            <div className="absolute top-10 -right-20 md:-right-32 px-4 py-1.5 rounded-full border-2 border-brand-green text-brand-green text-sm font-bold rotate-[-5deg] hidden sm:block">
              beginner friendly *
            </div>
            
            {/* 12 Departments Pill */}
            <div className="absolute bottom-4 -right-16 px-4 py-1.5 rounded-full border-2 border-brand-blue text-brand-blue text-sm font-bold rotate-[5deg] hidden sm:block">
              12 departments
            </div>

            {/* Yellow Blob */}
            <div className="absolute -top-10 -right-40 w-24 h-24 bg-brand-yellow rounded-full blur-[2px] hidden lg:block opacity-90 animate-pulse"></div>
          </motion.div>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-brand-muted max-w-2xl text-center mb-6"
          >
            Apply now to join <strong className="text-white">GDG VIT Chennai</strong>. Choose your department, showcase your skills, and become part of a community that builds gloriously over-ambitious side projects.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-8"
          >
            <Button asChild className="h-14 px-8 rounded-full bg-brand-yellow text-black hover:bg-brand-yellow/90 font-bold text-lg">
              <Link href="/auth/signin">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mr-2 text-black" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                  <path d="m12 15-3-3a22 22 0 0 1 3.82-13.04C14.73 1.83 17 3.33 17 6c0 2.67-1.5 4.17-3.82 4.96A22 22 0 0 1 12 15z"/>
                  <path d="M19 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                  <path d="M22 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
                </svg>
                Become a GDG Member
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-14 px-8 rounded-full border-brand-line text-white hover:bg-white/5 font-bold text-lg">
              <Link href="#departments">Explore Departments</Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-center w-full max-w-3xl border-t border-brand-line pt-8"
          >
            <div>
              <div className="text-4xl font-black text-brand-blue mb-1">12</div>
              <div className="text-sm text-brand-muted font-bold tracking-widest uppercase">departments</div>
            </div>
            <div>
              <div className="text-4xl font-black text-brand-red mb-1">17</div>
              <div className="text-sm text-brand-muted font-bold tracking-widest uppercase">student leads</div>
            </div>
            <div>
              <div className="text-4xl font-black text-brand-yellow mb-1">400+</div>
              <div className="text-sm text-brand-muted font-bold tracking-widest uppercase">members</div>
            </div>
            <div>
              <div className="text-4xl font-black text-brand-green mb-1">12+</div>
              <div className="text-sm text-brand-muted font-bold tracking-widest uppercase">events a year</div>
            </div>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="container max-w-6xl mx-auto px-4 py-24 z-20 relative border-t border-brand-line">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-brand-red font-bold tracking-widest text-sm uppercase mb-4">
                About the chapter
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                a home for builders <br /> on campus.
              </h2>
              {/* Red Squiggle */}
              <div className="mb-6 w-32 text-brand-red">
                <svg viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 15.5C35 -5.5 70 15.5 100 15.5C130 15.5 165 -5.5 198 15.5" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-brand-muted text-lg leading-relaxed max-w-lg">
                GDG on Campus · VIT Chennai is a student-led community backed by Google Developers. We run hands-on workshops, hackathons, and speaker sessions, no experience required, just curiosity and a slightly reckless will to build.
              </p>
            </motion.div>

            {/* Right side features */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col gap-10"
            >
              {/* Feature 1 */}
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <FaLaptopCode className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">learn by doing</h3>
                  <p className="text-brand-muted">every session ends with something you actually built.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <FaUserFriends className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">beginner friendly</h3>
                  <p className="text-brand-muted">peers and mentors who still remember day one.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-4">
                <div className="shrink-0 mt-1">
                  <FaGlobeAmericas className="w-6 h-6 text-brand-green" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">globally connected</h3>
                  <p className="text-brand-muted">part of GDG on Campus chapters worldwide.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Departments Section */}
        <section id="departments" className="container max-w-6xl mx-auto px-4 py-24 z-20 relative">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Technical Departments</h2>
            <p className="text-brand-muted text-lg">Build the future with us. Join a technical department and get your hands dirty with real projects.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {technicalDepartments.map((dept, i) => {
              const Icon = dept.icon;
              return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={i} 
                onClick={() => window.location.href = '/departments'}
                className="relative h-64 p-8 rounded-[32px] transition-transform duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:scale-[1.02]"
                style={{ backgroundColor: dept.tone }}
              >
                <div className="flex items-start justify-between relative z-10">
                  <strong className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">
                    {dept.name}
                  </strong>
                </div>
                
                {Icon && (
                  <Icon 
                    className="absolute top-6 right-6 w-32 h-32 text-white opacity-20 -rotate-12 pointer-events-none" 
                    strokeWidth={1.5}
                  />
                )}

                <p className="text-base text-white/90 relative z-10 font-medium leading-relaxed drop-shadow-sm">
                  {dept.description}
                </p>
              </motion.div>
            )})}
          </div>

          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Non-Technical Departments</h2>
            <p className="text-brand-muted text-lg">Shape the narrative. Lead, manage, and design the face of our community.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {nonTechnicalDepartments.map((dept, i) => {
              const Icon = dept.icon;
              return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={i} 
                onClick={() => window.location.href = '/departments'}
                className="relative h-64 p-8 rounded-[32px] transition-transform duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:scale-[1.02]"
                style={{ backgroundColor: dept.tone }}
              >
                <div className="flex items-start justify-between relative z-10">
                  <strong className="text-3xl font-bold text-white tracking-tight drop-shadow-sm">
                    {dept.name}
                  </strong>
                </div>
                
                {Icon && (
                  <Icon 
                    className="absolute top-6 right-6 w-32 h-32 text-white opacity-20 -rotate-12 pointer-events-none" 
                    strokeWidth={1.5}
                  />
                )}

                <p className="text-base text-white/90 relative z-10 font-medium leading-relaxed drop-shadow-sm">
                  {dept.description}
                </p>
              </motion.div>
            )})}
          </div>
        </section>

        <FAQSection />

        <Footer />
      </div>
    </main>
  );
}
