"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import BottomNav from "@/components/BottomNav";

export default function CheckoutPage() {
  const router = useRouter();
  const { getTotalPrice } = useCart();
  const { userData, setUserData } = useUser();
  const [whatsapp, setWhatsapp] = useState("");
  const [name, setName] = useState("");

  // Carregar dados salvos ao montar o componente
  useEffect(() => {
    if (userData) {
      setWhatsapp(userData.whatsapp || "");
      setName(userData.name || "");
    }
  }, [userData]);

  const formatWhatsApp = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");
    
    // Formata: (__) _____-____
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsApp(e.target.value);
    setWhatsapp(formatted);
  };

  const handleSubmit = () => {
    if (!whatsapp || !name) {
      alert("Por favor, preencha todos os campos");
      return;
    }
    
    // Salvar dados do usuário
    setUserData({ whatsapp, name });
    
    // Aqui você pode processar o pedido e gerar a cobrança
    alert("Processando pedido e gerando cobrança...");
    // TODO: Implementar lógica de pagamento
  };

  const isValid = whatsapp.replace(/\D/g, "").length >= 10 && name.trim().length > 0;

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 bg-white z-50 shadow-sm">
        <div className="max-w-md mx-auto">
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            onClick={() => router.back()}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Voltar"
          >
            <ChevronLeft size={24} color="#333" strokeWidth={2} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Identifique-se</h1>
        </div>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen w-full">
      <div className="flex-1 px-4 py-6">
        {/* WhatsApp */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Seu número de WhatsApp é:
          </label>
          <input
            type="tel"
            value={whatsapp}
            onChange={handleWhatsAppChange}
            placeholder="(__) _____-____"
            maxLength={15}
            className="w-full px-4 py-4 border-2 border-primary rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
          />
        </div>

        {/* Nome */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Seu nome e sobrenome:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome e sobrenome"
            className="w-full px-4 py-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
          />
        </div>

        {/* Botão Avançar */}
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className={`w-full py-4 rounded-lg font-semibold text-base transition-colors ${
            isValid
              ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Avançar
        </button>

        {/* Texto informativo */}
        <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
          Para realizar seu pedido vamos precisar de suas informações, este é um ambiente protegido.
        </p>
      </div>
      </div>

      {/* Footer fixo */}
      <BottomNav />
    </main>
  );
}
