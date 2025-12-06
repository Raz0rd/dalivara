"use client";

import { ReactNode } from "react";

interface TemplateWrapperProps {
  children: ReactNode;
}

export default function TemplateWrapper({ children }: TemplateWrapperProps) {
  const template = process.env.NEXT_PUBLIC_TEMPLATE || 'modelo1';
  
  // Modelo 1: Layout atual (mobile-first, centralizado)
  if (template === 'modelo1') {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen">
          {children}
        </div>
      </div>
    );
  }
  
  // Modelo 2: Layout delivery food (full width, estilo cardápio)
  if (template === 'modelo2') {
    return (
      <div className="min-h-screen bg-white modelo2-layout">
        {children}
      </div>
    );
  }
  
  // Fallback: modelo1
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen">
        {children}
      </div>
    </div>
  );
}
