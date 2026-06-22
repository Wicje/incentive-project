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
  "Final File Delivery Package",
  "Brand Language & Voice",
  "Photo Style Rules",
  "Supporting Brand Assets",
  "Full Identity Presentation",
  "Branding Guidelines Manual",
  "Collateral Applications",
  "Final System Delivery"
];

export default function BrandArchitectureTemplate() {
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
      {/* Decorative header border matching the Notion image */}
      <div className="h-4 w-full bg-[url('https://www.transparenttextures.com/patterns/notebook.png')] opacity-30 border-b border-stone-200"></div>
      
      <div className="max-w-4xl mx-auto w-full p-8 md:px-12 md:py-16 bg-white min-h-screen shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <Link href="/templates" className="inline-flex items-center text-[12px] font-medium text-stone-500 hover:text-stone-900 mb-8 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Templates
        </Link>
        
        <header className="mb-12 border-b border-[#EFEFEF] pb-8">
          <h1 className="text-4xl font-sans font-bold text-stone-900 tracking-tight mb-2">Full Branding Architecture</h1>
          <p className="text-stone-500 font-medium">A standardized 22-step process for complete brand identity systems.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-8 space-y-12">
            
            {/* Strategy Section */}
            <section>
              <h2 className="text-xl font-bold font-sans text-stone-800 border-b-2 border-stone-200 pb-2 mb-6">Brand Strategy</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-bold font-sans text-stone-900 mb-2">1. Vision Statement</h3>
                  <p className="text-[13px] text-stone-600 mb-4 italic">
                    Your vision is your why and the long-term vision for your work. A vision statement is all about where you want to go.
                  </p>
                  <textarea 
                    className="w-full bg-[#F5F5F3] p-4 rounded text-[14px] text-stone-800 font-medium border-l-2 border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-300 resize-none h-32"
                    placeholder="Write your vision statement..."
                    defaultValue="Example — To be a leading freelance graphic designer recognized for my innovative designs that inspire and engage audiences..."
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-sans text-stone-900 mb-2">2. Mission Statement</h3>
                  <p className="text-[13px] text-stone-600 mb-4 italic">
                    Your mission is what you do and how you&apos;re going to do it. Focused on the present.
                  </p>
                  <textarea 
                    className="w-full bg-[#F5F5F3] p-4 rounded text-[14px] text-stone-800 font-medium border-l-2 border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-300 resize-none h-32"
                    placeholder="Write your mission statement..."
                    defaultValue="Example — I am committed to delivering high-quality design solutions that help my clients achieve their goals..."
                  />
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold font-sans text-stone-900 mb-2">3. Brand personality</h3>
                <p className="text-[13px] text-stone-600 mb-4 italic">
                  Brand personality is like the personality of a person, but for a brand. It&apos;s the set of human characteristics that are attributed to a brand.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <textarea 
                    className="w-full bg-[#F5F5F3] p-4 rounded text-[14px] text-stone-800 font-medium border-l-2 border-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-300 resize-none h-full"
                    placeholder="Write your brand values..."
                    defaultValue="Example — my brand personality is creative, passionate, and detail oriented"
                  />
                  <div className="grid grid-cols-2 gap-y-2 text-[13px] text-stone-600 font-medium">
                    {["Innovative", "Authentic", "Bold", "Classic", "Creative", "Nostalgic", "Wholesome", "Playful"].map(adj => (
                       <label key={adj} className="flex items-center gap-2 cursor-pointer">
                         <input type="checkbox" className="rounded-sm border-stone-300 text-stone-600 focus:ring-stone-400" />
                         {adj}
                       </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-bold font-sans text-stone-900 mb-2">4. Target audience</h3>
                <p className="text-[13px] text-stone-600 mb-4 italic">
                  Target audience is the group of people that a product, service or brand is designed for.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Startups", desc: "Startups or established companies looking to rebrand." },
                    { title: "Solo-preneurs", desc: "Solo-preneurs looking to establish their personal brand." },
                    { title: "Small Businesses", desc: "Small local businesses looking to establish branding." }
                  ].map((persona, i) => (
                    <div key={i} className="border border-[#EFEFEF] rounded p-4">
                       <div className="h-24 bg-stone-50 rounded mb-4 flex items-center justify-center text-stone-400">
                         Illustration
                       </div>
                       <h4 className="font-bold text-[14px] mb-1">{persona.title}</h4>
                       <p className="text-[12px] text-stone-500 mb-3">{persona.desc}</p>
                       <div className="text-[11px] font-bold text-stone-700 uppercase tracking-widest mb-1">Key Psychographic</div>
                       <ul className="text-[12px] text-stone-600 list-disc pl-4 space-y-1">
                         <li>Prioritize cost-effectiveness</li>
                         <li>Lack of marketing expertise</li>
                       </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Visual Guide */}
            <section>
              <h2 className="text-xl font-bold font-sans text-stone-800 border-b-2 border-stone-200 pb-2 mb-6">Visual Guide</h2>
              
              <div className="mb-8">
                <h3 className="text-lg font-bold font-sans text-stone-900 mb-2">Color Palette</h3>
                <p className="text-[13px] text-stone-600 mb-4 italic">
                  The set of colors that a brand chooses to use in their logos, marketing materials, and other visual elements.
                </p>
                <div className="flex flex-wrap gap-4">
                  {[
                    { name: 'Primrose', hex: '#EAD3D0', type: 'Primary' },
                    { name: 'Crepe', hex: '#EBE2DC', type: 'Primary' },
                    { name: 'Ivory', hex: '#D6C0A6', type: 'Secondary' },
                    { name: 'Cinnamon', hex: '#A88D70', type: 'Secondary' },
                  ].map(color => (
                    <div key={color.name} className="w-28 border border-[#EFEFEF] rounded bg-white overflow-hidden shadow-sm">
                      <div className="h-20 w-full" style={{ backgroundColor: color.hex }}></div>
                      <div className="p-2">
                        <div className="font-bold text-[12px] text-stone-800">{color.name}</div>
                        <div className="text-[11px] text-stone-500 font-mono">{color.hex}</div>
                        <div className="mt-2 inline-block px-1.5 py-0.5 bg-stone-100 text-stone-600 text-[9px] uppercase tracking-widest font-bold rounded">
                          {color.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>

          <div className="md:col-span-4">
            <div className="sticky top-8 border-l border-stone-200 pl-6">
              <h3 className="font-bold font-sans text-lg text-stone-900 mb-4">The 22-Step Process</h3>
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
