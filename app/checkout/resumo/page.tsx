"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, CheckCircle2, Shield, Clock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { useLocation } from "@/hooks/useLocation";
import BottomNav from "@/components/BottomNav";
import OrderBump from "@/components/OrderBump";

export default function ResumoPage() {
  const router = useRouter();
  const { items, getTotalPrice, addItem } = useCart();
  const { userData } = useUser();
  const { location } = useLocation();

  const handleAddWater = (product: { id: string; name: string; price: number; image: string }) => {
    addItem({
      id: Date.now().toString(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
  };

  // Função para obter DDD baseado no estado
  const getDDD = (state: string) => {
    const dddMap: { [key: string]: string } = {
      AC: "68", AL: "82", AP: "96", AM: "92", BA: "71", CE: "85",
      DF: "61", ES: "27", GO: "62", MA: "98", MT: "65", MS: "67",
      MG: "31", PA: "91", PB: "83", PR: "41", PE: "81", PI: "86",
      RJ: "21", RN: "84", RS: "51", RO: "69", RR: "95", SC: "48",
      SP: "11", SE: "79", TO: "63"
    };
    return dddMap[state] || "85";
  };

  const phoneNumber = `(${getDDD(userData?.address?.state || "CE")}) 91111-1111`;

  useEffect(() => {
    // Redirecionar se não tiver dados
    if (!userData?.name || !userData?.email || !userData?.address) {
      router.push("/checkout/endereco");
    }
  }, [userData, router]);

  const handleConfirm = () => {
    // Aqui você implementa a lógica de pagamento
    alert("Processando pagamento...");
    // TODO: Integrar com gateway de pagamento
  };

  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col pb-24">
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
          <h1 className="text-lg font-semibold text-gray-900">Resumo do Pedido</h1>
        </div>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen w-full">
      <div className="flex-1 px-4 py-6">
        {/* Nota Fiscal */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg shadow-lg border-2 border-amber-200 overflow-hidden">
          {/* Header da Nota */}
          <div className="bg-amber-100 border-b-2 border-amber-300 px-4 py-4">
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-xl">👑</span>
                </div>
                <h2 className="font-bold text-gray-900 text-xl">NACIONAL AÇAÍ</h2>
              </div>
              <p className="text-sm font-semibold text-gray-700">Distribuidor Nacional de Açaí</p>
              <p className="text-xs text-gray-600">CNPJ: 64.744.999/0001-04</p>
              <p className="text-xs text-gray-600">Fone: {phoneNumber}</p>
            </div>
          </div>

          {/* Selos de Segurança */}
          <div className="bg-white/50 border-b border-amber-200 px-4 py-2">
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="flex items-center gap-1 text-xs text-gray-700">
                <Shield size={14} className="text-green-600" />
                <span className="font-semibold">Compra Segura</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-700">
                <CheckCircle2 size={14} className="text-blue-600" />
                <span className="font-semibold">Verificado</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-700">
                <Shield size={14} className="text-purple-600" />
                <span className="font-semibold">Autenticidade</span>
              </div>
            </div>
          </div>

          {/* Data e Hora */}
          <div className="px-4 py-2 bg-amber-50/50 border-b border-amber-200">
            <div className="flex justify-between text-xs text-gray-600">
              <span>Data: {dateStr}</span>
              <span>Hora: {timeStr}</span>
            </div>
          </div>

          {/* Dados do Cliente */}
          <div className="px-4 py-3 border-b border-amber-200">
            <h3 className="text-sm font-bold text-gray-900 mb-2">DADOS DO CLIENTE</h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p><span className="font-semibold">Nome:</span> {userData?.name}</p>
              <p><span className="font-semibold">Email:</span> {userData?.email}</p>
              <p><span className="font-semibold">WhatsApp:</span> {userData?.whatsapp}</p>
            </div>
          </div>

          {/* Endereço de Entrega */}
          <div className="px-4 py-3 border-b border-amber-200">
            <h3 className="text-sm font-bold text-gray-900 mb-2">ENDEREÇO DE ENTREGA</h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p>{userData?.address?.street}, {userData?.address?.number}</p>
              {userData?.address?.complement && (
                <p>{userData.address.complement}</p>
              )}
              <p>{userData?.address?.neighborhood}</p>
              <p>
                {userData?.address?.city} - {userData?.address?.state}
              </p>
              <p>CEP: {userData?.address?.cep}</p>
            </div>
          </div>

          {/* Tempo de Entrega */}
          {location && (
            <div className="px-4 py-2 bg-green-50 border-b border-amber-200">
              <div className="flex items-center gap-2 text-sm text-green-800">
                <Clock size={16} />
                <span className="font-semibold">
                  Tempo estimado: {location.deliveryTime} minutos
                </span>
              </div>
            </div>
          )}

          {/* Itens do Pedido */}
          <div className="px-4 py-3 border-b-2 border-dashed border-amber-300">
            <h3 className="text-sm font-bold text-gray-900 mb-3">ITENS DO PEDIDO</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    {item.customizations && (
                      <div className="text-xs text-gray-600 mt-1">
                        {item.customizations.acaiCremes && item.customizations.acaiCremes.length > 0 && (
                          <p>• {item.customizations.acaiCremes.join(", ")}</p>
                        )}
                        {item.customizations.adicionais && item.customizations.adicionais.length > 0 && (
                          <p>• {item.customizations.adicionais.join(", ")}</p>
                        )}
                        {item.customizations.coberturas && item.customizations.coberturas.length > 0 && (
                          <p>• {item.customizations.coberturas.join(", ")}</p>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-gray-600 mt-1">Qtd: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="px-4 py-4 bg-amber-100">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">TOTAL</span>
              <span className="text-2xl font-bold text-primary">
                R$ {getTotalPrice().toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>

          {/* Rodapé da Nota */}
          <div className="bg-amber-50 px-4 py-3 border-t-2 border-amber-300">
            <p className="text-xs text-center text-gray-600 leading-relaxed">
              Documento válido como comprovante de pedido.
              <br />
              Mantenha este comprovante até a entrega do produto.
            </p>
          </div>
        </div>

        {/* Order Bump - Água */}
        <div className="mt-6">
          <OrderBump onAddToCart={handleAddWater} />
        </div>

        {/* Botão Confirmar */}
        <button
          onClick={handleConfirm}
          className="w-full mt-6 py-4 bg-primary text-white font-bold text-lg rounded-lg hover:bg-primary/90 transition-colors shadow-lg"
        >
          Confirmar e Pagar
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Ao confirmar, você concorda com nossos termos de serviço
        </p>
      </div>
      </div>

      <BottomNav />
    </main>
  );
}
