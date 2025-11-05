"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, MapPin } from "lucide-react";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import BottomNav from "@/components/BottomNav";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useUser } from "@/contexts/UserContext";

interface AddressData {
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string;
}

export default function EnderecoPage() {
  const router = useRouter();
  const { userData, setUserData } = useUser();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [address, setAddress] = useState<AddressData>({
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    complement: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepError, setCepError] = useState("");

  // Reviews
  const reviews = [
    "/products/reviews/1.webp",
    "/products/reviews/2.webp",
    "/products/reviews/3.webp",
    "/products/reviews/4.webp",
    "/products/reviews/5.webp",
    "/products/reviews/6.webp",
    "/products/reviews/7.webp",
    "/products/reviews/8.webp",
    "/products/reviews/9.webp",
    "/products/reviews/10.webp",
  ];

  useEffect(() => {
    // Carregar dados salvos
    if (userData) {
      setFullName(userData.name || "");
      setEmail(userData.email || "");
      if (userData.address) {
        setAddress({
          ...userData.address,
          number: userData.address.number || "",
        });
        setCep(userData.address.cep);
      }
    }
  }, [userData]);

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCEP(e.target.value);
    setCep(formatted);
    setCepError("");

    const numbers = formatted.replace(/\D/g, "");
    
    if (numbers.length === 8) {
      setLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${numbers}/json/`);
        const data = await response.json();

        if (data.erro) {
          setCepError("CEP não encontrado");
          setAddress({
            cep: formatted,
            street: "",
            number: "",
            neighborhood: "",
            city: "",
            state: "",
            complement: "",
          });
        } else {
          setAddress({
            cep: formatted,
            street: data.logradouro,
            number: address.number || "",
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
            complement: "",
          });
        }
      } catch (error) {
        setCepError("Erro ao buscar CEP");
      } finally {
        setLoadingCep(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!isValid) return;

    setIsSubmitting(true);

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Salvar dados completos
    setUserData({
      ...userData,
      name: fullName,
      email,
      address,
    });

    // Ir para resumo do pedido
    router.push("/ifoodpay");
  };

  const isValid =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    cep.replace(/\D/g, "").length === 8 &&
    address.street.length > 0 &&
    address.number.trim().length > 0;

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col pb-32">
      {/* Loading Overlay */}
      {isSubmitting && <LoadingOverlay />}
      
      {/* Header */}
      <header className="sticky top-0 bg-white z-50 shadow-sm">
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            onClick={() => router.back()}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Voltar"
          >
            <ChevronLeft size={24} color="#333" strokeWidth={2} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Dados de Entrega</h1>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="flex-1 px-4 py-6 space-y-4">
        {/* Nome Completo */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Nome completo *
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Seu nome completo"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* CEP */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            CEP *
          </label>
          <div className="relative">
            <input
              type="text"
              value={cep}
              onChange={handleCepChange}
              placeholder="00000-000"
              maxLength={9}
              className={`w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary ${
                cepError ? "border-red-500" : "border-gray-300"
              }`}
            />
            {loadingCep && (
              <div className="absolute right-3 top-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          {cepError && <p className="text-red-500 text-sm mt-1">{cepError}</p>}
        </div>

        {/* Endereço (auto-preenchido) */}
        {address.street && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Endereço
              </label>
              <input
                type="text"
                value={address.street}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50"
              />
            </div>

            {/* Número */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Número *
              </label>
              <input
                type="text"
                value={address.number}
                onChange={(e) =>
                  setAddress({ ...address, number: e.target.value })
                }
                placeholder="Número da casa/apto"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  value={address.neighborhood}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  value={`${address.city} - ${address.state}`}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base bg-gray-50"
                />
              </div>
            </div>

            {/* Complemento */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Complemento (opcional)
              </label>
              <input
                type="text"
                value={address.complement}
                onChange={(e) =>
                  setAddress({ ...address, complement: e.target.value })
                }
                placeholder="Apto, bloco, casa, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </>
        )}
      </div>

      {/* Reviews Carousel */}
      <ReviewsCarousel reviews={reviews} />

      {/* Botão Avançar Fixo */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-lg">
        <button
          onClick={handleSubmit}
          disabled={!isValid || isSubmitting}
          className={`w-full py-4 rounded-lg font-semibold text-base transition-colors ${
            isValid
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continuar
        </button>
      </div>

      <BottomNav />
    </main>
  );
}
