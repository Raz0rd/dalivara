"use client";

export default function HomeHeader() {
  return (
    <header className="sticky top-0 bg-primary z-50 shadow-md">
      <div className="flex items-center justify-center px-4 py-4 relative">
        {/* Logo e Nome Centralizados */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
            <span className="text-3xl">👑</span>
          </div>
          <span className="text-white font-bold text-xl">Nacional Açaí</span>
        </div>

        {/* Ícones à direita (posicionamento absoluto) */}
        
      </div>
    </header>
  );
}
