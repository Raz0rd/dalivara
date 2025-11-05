"use client";

import { ChevronLeft, Search, Share2 } from "lucide-react";

interface HeaderProps {
  title: string;
  onBack?: () => void;
  onSearch?: () => void;
  onShare?: () => void;
}

export default function Header({ title, onBack, onSearch, onShare }: HeaderProps) {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Voltar"
            >
              <ChevronLeft size={28} color="#333" strokeWidth={2} />
            </button>
            <span className="text-base font-medium text-gray-800">{title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSearch}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Pesquisar"
            >
              <Search size={16} color="#333" strokeWidth={2} />
            </button>
            <button
              onClick={onShare}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Compartilhar"
            >
              <Share2 size={16} color="#333" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>
      <div className="h-14"></div>
    </>
  );
}
