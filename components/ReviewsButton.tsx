"use client";

import { Star, ChevronRight } from "lucide-react";

interface ReviewsButtonProps {
  onClick: () => void;
}

export default function ReviewsButton({ onClick }: ReviewsButtonProps) {
  return (
    <button
      onClick={onClick}
      className="hidden lg:flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold group"
    >
      <div className="flex items-center gap-1">
        <Star size={20} fill="white" />
        <Star size={20} fill="white" />
        <Star size={20} fill="white" />
        <Star size={20} fill="white" />
        <Star size={20} fill="white" />
      </div>
      <span className="text-sm">Ver Avaliações</span>
      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
    </button>
  );
}
