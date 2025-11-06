"use client";

import { Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

interface PixPaymentProps {
  pixCode: string;
  pixQrCode: string;
  onCopy: () => void;
  isPaid?: boolean;
  onTestPayment?: () => void;
}

const deliveryNames = ['M.Souza', 'J.Silva', 'R.Santos', 'A.Costa', 'P.Oliveira', 'C.Pereira', 'L.Alves', 'F.Lima'];

export default function PixPayment({ pixCode, pixQrCode, onCopy, isPaid = false, onTestPayment }: PixPaymentProps) {
  const [copied, setCopied] = useState(false);
  const [copying, setCopying] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState(30); // Tempo em minutos
  const [orderStatus, setOrderStatus] = useState<'preparing' | 'out_for_delivery'>('preparing');
  const [deliveryPerson, setDeliveryPerson] = useState('');
  const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // Carregar estado do localStorage ao montar
  useEffect(() => {
    if (isPaid) {
      const savedState = localStorage.getItem('orderTrackingState');
      
      if (savedState) {
        // Recuperar estado salvo
        const state = JSON.parse(savedState);
        const elapsedMinutes = Math.floor((Date.now() - state.startTime) / 60000);
        const newDeliveryTime = Math.max(0, state.initialTime - elapsedMinutes);
        
        setDeliveryTime(newDeliveryTime);
        setDeliveryPerson(state.deliveryPerson);
        
        // Determinar status baseado no tempo
        if (newDeliveryTime > 15) {
          setOrderStatus('preparing');
        } else if (newDeliveryTime > 5) {
          setOrderStatus('out_for_delivery');
        } else {
          // Reset
          setDeliveryTime(60);
          setOrderStatus('preparing');
        }
      } else {
        // Primeiro acesso - criar novo estado
        const randomName = deliveryNames[Math.floor(Math.random() * deliveryNames.length)];
        setDeliveryPerson(randomName);
        
        const initialState = {
          startTime: Date.now(),
          initialTime: 30,
          deliveryPerson: randomName,
        };
        
        localStorage.setItem('orderTrackingState', JSON.stringify(initialState));
      }
    }
  }, [isPaid]);

  // Atualizar tempo de entrega e status a cada minuto
  useEffect(() => {
    if (isPaid) {
      const interval = setInterval(() => {
        setDeliveryTime((prev) => {
          const newTime = prev - 1;
          
          // Quando chegar em 15min, muda status para "saiu para entrega"
          if (newTime === 15) {
            setOrderStatus('out_for_delivery');
          }
          
          if (newTime <= 5) {
            // Se faltar 5min ou menos, adiciona 1 hora (60 minutos)
            setOrderStatus('preparing'); // Volta para preparando
            
            // Atualizar localStorage com novo ciclo
            const savedState = localStorage.getItem('orderTrackingState');
            if (savedState) {
              const state = JSON.parse(savedState);
              const newState = {
                ...state,
                startTime: Date.now(),
                initialTime: 60,
              };
              localStorage.setItem('orderTrackingState', JSON.stringify(newState));
            }
            
            return 60;
          }
          
          return newTime;
        });
      }, 60000); // A cada 1 minuto

      return () => clearInterval(interval);
    }
  }, [isPaid]);

  const handleCopy = async () => {
    setCopying(true);
    await navigator.clipboard.writeText(pixCode);
    onCopy();
    setCopying(false);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-gray-200 p-4 md:p-7 bg-white rounded-lg max-sm:rounded-none">
      <div className="text-center">
        {isPaid ? (
          /* Pagamento Confirmado - Estilo iFood */
          <div className="bg-[#2d2d2d] text-white rounded-lg p-6 -m-4 md:-m-7">
            {/* Header com logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#ea1d2c] rounded-full flex items-center justify-center">
                <span className="text-2xl">🍴</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-base">Nacional Açaí</p>
                <p className="text-xs text-gray-400">{deliveryTime}min</p>
              </div>
            </div>

            {/* Previsão de entrega */}
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">Previsão de entrega</p>
              <p className="text-3xl font-bold mb-4">
                {new Date(Date.now() + deliveryTime * 60000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </p>
              
              {/* Barra de progresso */}
              <div className="w-full h-1 bg-gray-700 rounded-full mb-4 overflow-hidden">
                <div 
                  className="h-full bg-[#00d632] rounded-full animate-pulse transition-all duration-1000" 
                  style={{ 
                    width: orderStatus === 'preparing' 
                      ? `${Math.min(50, ((30 - deliveryTime) / 30) * 50)}%` 
                      : `${50 + ((15 - deliveryTime) / 15) * 50}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Status do pedido */}
            <div className="bg-[#1a1a1a] rounded-lg p-4 text-left">
              <div className="flex items-center gap-3">
                {orderStatus === 'preparing' ? (
                  <>
                    <div className="text-3xl">🥤</div>
                    <p className="text-base font-semibold">Pedido sendo preparado</p>
                  </>
                ) : (
                  <>
                    <div className="text-3xl">🏍️</div>
                    <div>
                      <p className="text-base font-semibold">Pedido saiu para entrega</p>
                      <p className="text-xs text-gray-400 mt-1">Entregador: {deliveryPerson}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Informações do pedido */}
            <div className="mt-4 pt-4 border-t border-gray-700 text-left">
              <p className="text-xs text-gray-400 flex items-center gap-2">
                <span>📦</span>
                <span>Nacional Açaí • Pedido #{Math.floor(1000 + Math.random() * 9000)}</span>
              </p>
            </div>

            {/* Mensagem de redirecionamento */}
            <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3 text-green-400">
                <div className="text-2xl">✅</div>
                <div className="text-left">
                  <p className="font-semibold text-sm">Pagamento Confirmado!</p>
                  <p className="text-xs text-green-300 mt-1">
                    Redirecionando para seus pedidos em instantes...
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Aguardando Pagamento */
          <>
            {/* Título */}
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Pagamento via PIX
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Escaneie o QR Code ou copie o código para pagar
            </p>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            {pixQrCode ? (
              <Image
                src={pixQrCode}
                alt="QR Code PIX"
                width={256}
                height={256}
                className="w-64 h-64"
              />
            ) : (
              <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-2">📱</div>
                  <p className="text-sm text-gray-500">Gerando QR Code...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Código PIX */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-slate-900 mb-2">
            Código PIX (Copia e Cola)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={pixCode}
              readOnly
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-sm bg-gray-50 font-mono"
            />
            <button
              onClick={handleCopy}
              disabled={copying}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                copied
                  ? "bg-green-500 text-white"
                  : copying
                  ? "bg-gray-400 text-white cursor-wait"
                  : "bg-[#f02f2f] text-white hover:bg-[#f02f2f]/90"
              }`}
            >
              {copying ? (
                <>
                  <div className="w-5 h-5 inline-block mr-1 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Copiando...
                </>
              ) : copied ? (
                <>
                  <Check className="w-5 h-5 inline mr-1" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 inline mr-1" />
                  Copiar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instruções */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <h3 className="font-semibold text-sm text-blue-900 mb-3">
            Como pagar com PIX:
          </h3>
          <ol className="text-sm text-blue-800 space-y-2">
            <li className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>Abra o app do seu banco e escolha a opção PIX</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>Escaneie o QR Code acima ou cole o código copiado</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>Confirme as informações e finalize o pagamento</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">4.</span>
              <span>Pronto! Seu pedido será confirmado automaticamente</span>
            </li>
          </ol>
        </div>

            {/* Aviso */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⏰ <strong>Atenção:</strong> O código PIX expira em 30 minutos. 
                Após o pagamento, seu pedido será confirmado automaticamente.
              </p>
            </div>

            {/* Botão de Teste (apenas localhost) */}
            {isLocalhost && onTestPayment && (
              <div className="mt-6 p-4 bg-purple-50 border-2 border-purple-500 rounded-lg">
                <p className="text-sm text-purple-800 mb-3 font-semibold">
                  🧪 MODO DE TESTE (Localhost)
                </p>
                <button
                  onClick={onTestPayment}
                  className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  ✅ Simular Pagamento Aprovado
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
