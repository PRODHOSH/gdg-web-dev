"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const faqs = [
  {
    question: "Who can apply?",
    answer: "Anyone currently studying at VIT Chennai! No prior experience is required, just curiosity and a willingness to learn and build.",
  },
  {
    question: "Can I apply to multiple departments?",
    answer: "Yes, you can apply to up to two departments of your choice during the recruitment process.",
  },
  {
    question: "What is the selection process like?",
    answer: "It generally involves an initial application review followed by a short task or an interview, depending on the department you choose.",
  },
  {
    question: "Is there a membership fee?",
    answer: "No, joining and participating in GDG VIT Chennai is completely free. We believe in accessible education and community building.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="container max-w-4xl mx-auto px-4 py-24 z-20 relative border-t border-brand-line">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Frequently Asked Questions</h2>
        <p className="text-brand-muted text-lg">Got questions? We've got answers.</p>
      </div>

      <div className="space-y-4 mb-12">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="border border-brand-line bg-[#111111] rounded-2xl overflow-hidden transition-colors hover:border-brand-line/80"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="text-lg font-bold text-white">{faq.question}</span>
              <ChevronDown 
                className={`w-5 h-5 text-brand-muted transition-transform duration-300 ${openIndex === index ? "rotate-180 text-brand-blue" : ""}`} 
              />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 text-brand-muted leading-relaxed">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-brand-blue/5 border border-brand-blue/20">
        <h3 className="text-2xl font-bold text-white mb-2">Still have questions?</h3>
        <p className="text-brand-muted mb-6">Check out our comprehensive recruitment guide and detailed FAQs.</p>
        <Button asChild className="bg-brand-blue text-black hover:bg-brand-blue/90 font-bold rounded-full px-8 h-12">
          <Link 
            href="https://docs.google.com/document/d/1nkCCHtfCWqLvFjlYgb5EmNG9xmhrsuUEDxEluKtO_Ug/edit?tab=t.0#heading=h.wxxhvssdozym" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Read Detailed Info
          </Link>
        </Button>
      </div>
    </section>
  );
}
