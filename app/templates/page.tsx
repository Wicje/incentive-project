"use client";

import Link from 'next/link';
import { Target, PenTool, LayoutTemplate } from 'lucide-react';

export default function TemplatesPage() {
  const templates = [
    {
      id: 'brand-architecture',
      title: 'Full Brand Architecture',
      description: 'A 22-step comprehensive branding framework for a complete identity system.',
      icon: LayoutTemplate,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      href: '/templates/brand-architecture'
    },
    {
      id: 'logo-architecture',
      title: 'Logo Architecture',
      description: 'A 15-step focused framework for professional logo design and delivery.',
      icon: PenTool,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
      href: '/templates/logo-architecture'
    }
  ];

  return (
    <div className="flex h-full bg-white flex-col w-full overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full p-8 md:p-12">
        <header className="mb-10">
          <h1 className="text-3xl font-sans font-bold text-stone-900 tracking-tight flex items-center gap-3">
            <Target className="w-8 h-8 text-stone-700" />
            Template Library
          </h1>
          <p className="text-stone-500 font-medium mt-2">Standardize your workflow with proven frameworks and architectures.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map(template => (
            <Link key={template.id} href={template.href}>
              <div className="group border border-[#EFEFEF] bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer h-full">
                <div className={`w-12 h-12 rounded-lg ${template.bg} ${template.color} flex items-center justify-center mb-6`}>
                  <template.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-sans text-stone-900 mb-2 group-hover:text-stone-700 transition-colors">
                  {template.title}
                </h3>
                <p className="text-[14px] text-stone-500 font-medium leading-relaxed">
                  {template.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
