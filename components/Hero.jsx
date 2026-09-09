"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const [userActionCount, setUserActionCount] = useState(0);

  return (
    <main className="relative flex flex-col items-center justify-center min-h-[85vh] px-4 text-center z-10 w-full max-w-6xl mx-auto">
      
      {/* Floating Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="absolute top-20 left-[10%] md:left-[20%] flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-medium border rounded-full text-brand-muted border-brand-line/40 bg-brand-dark/50 backdrop-blur-sm"
      >
        <span className="w-2 h-2 rounded-full bg-brand-green" />
        Student Dev Community • backed by Google Developers
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="absolute top-40 right-[15%] md:right-[25%] flex items-center gap-1.5 px-4 py-1.5 text-xs md:text-sm font-medium border rounded-full text-brand-green border-brand-green bg-brand-dark/50 backdrop-blur-sm rotate-2"
      >
        beginner friendly ✳
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="absolute bottom-32 right-[20%] md:right-[30%] flex items-center gap-1.5 px-4 py-1.5 text-xs md:text-sm font-medium border rounded-full text-brand-blue border-brand-blue bg-brand-dark/50 backdrop-blur-sm -rotate-3"
      >
        12 departments
      </motion.div>

      {/* Main Typography */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="flex flex-col items-center max-w-4xl mx-auto mt-12 md:mt-24"
      >
        <div className="absolute top-32 left-[15%] text-brand-yellow hidden md:block">
          <Star className="w-6 h-6 fill-brand-yellow animate-pulse" />
        </div>
        <div className="absolute top-52 left-[10%] text-brand-blue hidden md:block">
          {/* Lightning bolt SVG */}
          <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.9248 1.14441L1.64415 15.3283C1.04705 16.0792 1.58309 17.1856 2.54471 17.1856H11.7588V30.1287C11.7588 31.0664 12.928 31.4883 13.5284 30.762L22.9592 19.3498C23.6393 18.5268 23.0537 17.2917 21.9902 17.2917H12.9248V1.95679C12.9248 1.13963 11.979 0.722521 11.3916 1.30058L12.9248 1.14441Z" stroke="#8AB4F8" strokeWidth="2"/>
          </svg>
        </div>

        <h1 className="text-[3.5rem] md:text-[6rem] lg:text-[7rem] font-extrabold tracking-tighter leading-[1.05] text-white text-left md:text-center px-4 w-full">
          we build <span className="text-brand-blue">weird,</span><br/>
          wonderful <span className="text-brand-red">things</span><br/>
          <span className="relative inline-block">
            together
            {/* Wavy Underline SVG */}
            <svg className="absolute -bottom-2 md:-bottom-4 left-0 w-full" viewBox="0 0 351 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 13.5C28.2576 4.79374 54.1953 2.05923 80.5 4.5C118.887 8.06208 156.452 14.8647 194.5 13.5C232.062 12.1527 269.878 5.75336 307.5 2.5C321.36 1.30132 335.253 1.01825 349 1.5" stroke="#FFD45E" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </span>
        </h1>
        
        <p className="max-w-2xl mt-12 text-lg md:text-xl font-medium text-brand-muted text-left md:text-center px-4 leading-relaxed">
          The home for builders at <strong className="text-white">VIT Chennai</strong>, twelve departments, 
          dozens of student leads, and a year of workshops, hackathons and 
          gloriously over-ambitious side projects.
        </p>
      </motion.div>
    </main>
  );
}


