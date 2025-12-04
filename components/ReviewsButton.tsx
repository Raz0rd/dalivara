"use client";

import { Star, ChevronRight } from "lucide-react";

interface ReviewsButtonProps {
  onClick: () => void;
}

export default function ReviewsButton({ onClick }: ReviewsButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold group text-xs"
    >
      <div className="flex items-center gap-0.5">
        <Star size={14} fill="white" />
        <Star size={14} fill="white" />
        <Star size={14} fill="white" />
        <Star size={14} fill="white" />
        <Star size={14} fill="white" />
      </div>
      <span className="hidden sm:inline">Ver Avaliações</span>
      <span className="sm:hidden">Avaliações</span>
      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
    </button>
  );
}
