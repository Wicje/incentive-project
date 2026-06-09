"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';

const steps = [
  "Client Intake & Brief",
  "Competitor Research",
  "Target Audience Profile",
  "Brand Positioning Scales",
  "Style Direction — Mood Boards",
  "Client Direction Lockup",
  "Word Mapping & Brainstorm",
  "Thumbnail Sketching",
  "Vectorize Concepts",
  "Typography Pairings Study",
  "Color Palette System",
  "Logo Matrix Variations",
  "Clear Space Spacing Rules",
  "Concept Deck Presentation",
  "Final File Delivery Package"
];

export default function LogoArchitectureTemplate() {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    const next = new Set(completedSteps);
    if (next.has(index)) {
      next.delete(index);
    } else {
      next.add(index);
    }
    setCompletedSteps(next);
  };

  return (
    <div className="flex h-full bg-[#FAF9F6] flex-col w-full overflow-y-auto">
      {/* Decorative header border */}
      <div className="h-4 w-full bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-30 border-b border-stone-200"></div>
      
      <div className="max-w-4xl mx-auto w-full p-8 md:px-12 md:py-16 bg-white min-h-screen shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <Link href="/templates" className="inline-flex items-center text-[12px] font-medium text-stone-500 hover:text-stone-900 mb-8 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Templates
        </Link>
        
        <header className="mb-12 border-b border-[#EFEFEF] pb-8">
          <h1 className="text-4xl font-sans font-bold text-stone-900 tracking-tight mb-2">Logo Architecture</h1>
          <p className="text-stone-500 font-medium">A standardized 15-step process for focused logo design and delivery.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-8 space-y-12">
            
            <section>
              <h2 className="text-xl font-bold font-sans text-stone-800 border-b-2 border-stone-200 pb-2 mb-6">Logo Concepting</h2>
              
              <div className="mb-8">
                <h3 className="text-lg font-bold font-sans text-stone-900 mb-2">Word Mapping</h3>
                <p className="text-[13px] text-stone-600 mb-4 italic">
                  Brainstorm key concepts, synonyms, and visual metaphors associated with the brand core identity.
                </p>
                <div className="bg-[#F5F5F3] p-6 rounded border-l-2 border-stone-400">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {["Trust", "Speed", "Innovation", "Growth", "Security", "Agility", "Vision", "Strength"].map((word) => (
                      <div key={word} className="bg-white py-2 px-3 rounded shadow-sm text-[13px] font-bold text-stone-700 border border-[#EFEFEF]">
                        {word}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold font-sans text-stone-900 mb-2">Mood Boards & Style Direction</h3>
                <p className="text-[13px] text-stone-600 mb-4 italic">
                  Compile references to establish the visual language before sketching.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="aspect-square bg-stone-100 rounded border border-[#EFEFEF] flex items-center justify-center text-stone-400">
                      Upload Image
                    </div>
                  ))}
                </div>
              </div>

            </section>

            <section>
              <h2 className="text-xl font-bold font-sans text-stone-800 border-b-2 border-stone-200 pb-2 mb-6">Execution Guidelines</h2>
              
              <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold font-sans text-stone-900 mb-2">Typography Setup</h3>
                  <p className="text-[13px] text-stone-600 mb-4 italic">
                     Primary and secondary font families for logotype and descriptor.
                  </p>
                  <div className="border border-[#EFEFEF] rounded p-4 h-32 flex flex-col justify-center items-center text-center bg-[#FAF9F6]">
                    <div className="font-serif text-2xl text-stone-800 mb-1">Playfair Display</div>
                    <div className="text-[10px] uppercase tracking-widest text-stone-500 font-bold font-sans">Primary Serif</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-sans text-stone-900 mb-2">Clear Space</h3>
                  <p className="text-[13px] text-stone-600 mb-4 italic">
                    Define the minimum breathing room around the logo mark.
                  </p>
                  <div className="border border-[#EFEFEF] rounded p-4 h-32 flex justify-center items-center bg-white">
                    <div className="relative border border-dashed border-stone-400 p-4">
                      <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center text-white font-bold">L</div>
                      <div className="absolute top-0 right-[-20px] text-[10px] text-stone-400 font-mono">1x</div>
                      <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-[10px] text-stone-400 font-mono">1x</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>

          <div className="md:col-span-4">
            <div className="sticky top-8 border-l border-stone-200 pl-6">
              <h3 className="font-bold font-sans text-lg text-stone-900 mb-4">The 15-Step Process</h3>
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const isDone = completedSteps.has(index);
                  return (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 cursor-pointer group"
                      onClick={() => toggleStep(index)}
                    >
                      <button className={`mt-0.5 transition-colors ${isDone ? 'text-stone-900' : 'text-stone-300 group-hover:text-stone-500'}`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                      </button>
                      <div className="flex-1">
                        <span className={`text-[13px] font-medium leading-snug block mt-0.5 ${isDone ? 'text-stone-400 line-through' : 'text-stone-800'}`}>
                          {index + 1}. {step}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
