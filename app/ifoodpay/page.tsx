"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Info, LockKeyhole } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { reportConversion } from "@/utils/googleAds";
import { gtag_report_conversion } from "@/config/googleAds";
import DeliveryOptions from "@/components/DeliveryOptions";
import OrderSummary from "@/components/OrderSummary";
import PixPayment from "@/components/PixPayment";
import LoadingOverlay from "@/components/LoadingOverlay";
import RecoverOrderModal from "@/components/RecoverOrderModal";
import Image from "next/image";

export default function IfoodPayPage() {
  const router = useRouter();
  const { items, getTotalPrice, addItem, removeItem, clearCart } = useCart();
  const { userData } = useUser();
  const [showSummary, setShowSummary] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [currentStep, setCurrentStep] = useState<"personal" | "delivery" | "summary" | "payment">("personal");
  const [deliveryData, setDeliveryData] = useState<any>(null);
  const [pixCode, setPixCode] = useState("");
  const [pixQrCode, setPixQrCode] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [tip, setTip] = useState(0);
  const [showRecoverModal, setShowRecoverModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const totalPrice = getTotalPrice();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Ref para armazenar a função de limpeza do polling
  const [cleanupPolling, setCleanupPolling] = useState<(() => void) | null>(null);

  // Limpar polling ao desmontar ou sair da página de pagamento
  useEffect(() => {
    return () => {
      if (cleanupPolling) {
        cleanupPolling();
      }
    };
  }, [cleanupPolling]);

  // Verificar pedido salvo no localStorage
  useEffect(() => {
    // Verificar se há um pedido pago em andamento
    const trackingState = localStorage.getItem('orderTrackingState');
    if (trackingState) {
      const state = JSON.parse(trackingState);
      // Se há tracking ativo, ir direto para tela de pagamento confirmado
      setIsPaid(true);
      setCurrentStep("payment");
      return;
    }
    
    // Verificar pedido pendente
    const savedOrder = localStorage.getItem('pendingOrder');
    if (savedOrder) {
      const order = JSON.parse(savedOrder);
      const expirationTime = order.expiresAt;
      const now = Date.now();

      // Verificar se ainda está dentro dos 30 minutos
      if (now < expirationTime) {
        setShowRecoverModal(true);
      } else {
        // Expirou, limpar localStorage
        localStorage.removeItem('pendingOrder');
      }
    }
  }, []);

  const handleContinueOrder = () => {
    const savedOrder = localStorage.getItem('pendingOrder');
    if (savedOrder) {
      const order = JSON.parse(savedOrder);
      setPixCode(order.pixCode);
      setPixQrCode(order.pixQrCode);
      setDeliveryData(order.deliveryData);
      setCpf(order.cpf);
      setPhone(order.phone);
      setCurrentStep("payment");
      const cleanup = startStatusPolling(order.transactionId);
      if (cleanup) setCleanupPolling(() => cleanup);
    }
    setShowRecoverModal(false);
  };

  const handleStartNewOrder = () => {
    localStorage.removeItem('pendingOrder');
    setShowRecoverModal(false);
  };

  const handleContinueFromPersonal = () => {
    setCurrentStep("delivery");
  };

  const handleContinueFromDelivery = (data: any) => {
    setDeliveryData(data);
    setCurrentStep("summary");
  };

  const handleConfirmOrder = async () => {
    setIsConfirming(true);
    
    try {
      // Calcular total com gorjeta
      const totalWithTip = totalPrice + tip;
      // Converter para centavos (multiplicar por 100) e garantir que é inteiro
      const amountInCents = Math.round(totalWithTip * 100);
      
      // Preparar dados do pedido - Enviar apenas produto consolidado "Delivara"
      const payload = {
        hostname: window.location.hostname,
        nome: userData?.name || '',
        email: userData?.email || '',
        phone: phone,
        cpf: cpf,
        amount: amountInCents, // Valor total em centavos (sem . ou ,)
        quantity: 1, // Sempre 1 produto consolidado
        productTitle: "Delivara", // Nome fixo para o gateway
        address: userData?.address,
      };

      // Fazer requisição para gerar PIX
      const response = await fetch('/api/payment/pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setPixCode(data.pixData.code);
        setPixQrCode(data.pixData.qrCode);
        setIsConfirming(false);
        setCurrentStep("payment");
        
        // Salvar no localStorage com expiração de 30 minutos
        const orderData = {
          pixCode: data.pixData.code,
          pixQrCode: data.pixData.qrCode,
          transactionId: data.transactionId,
          deliveryData: deliveryData,
          cpf: cpf,
          phone: phone,
          expiresAt: Date.now() + (30 * 60 * 1000), // 30 minutos
        };
        localStorage.setItem('pendingOrder', JSON.stringify(orderData));
        
        // Iniciar polling de status e armazenar função de limpeza
        const cleanup = startStatusPolling(data.transactionId);
        if (cleanup) setCleanupPolling(() => cleanup);
      } else {
        setIsConfirming(false);
        alert('Erro ao gerar PIX: ' + data.message);
      }
    } catch (error) {
      setIsConfirming(false);
      console.error('Erro ao confirmar pedido:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    }
  };

  const startStatusPolling = (transactionId: string) => {
    let interval: NodeJS.Timeout;

    const checkStatus = async () => {
      // Só verificar se o usuário ainda está na página de pagamento
      if (currentStep !== 'payment') {
        if (interval) clearInterval(interval);
        return;
      }

      try {
        const response = await fetch(`/api/payment/status/${transactionId}`);
        const data = await response.json();

        if (data.success && data.paid) {
          if (interval) clearInterval(interval);
          localStorage.removeItem('pendingOrder'); // Limpar pedido salvo
          
          // Atualizar estado para mostrar confirmação
          setIsPaid(true);
          
          // Calcular valor total com gorjeta
          const totalWithTip = totalPrice + tip;
          
          // Salvar pedido pago
          const paidOrder = {
            transactionId: transactionId,
            pixCode: pixCode,
            amount: Math.round(totalWithTip * 100),
            items: items,
            status: 'paid',
            paidAt: Date.now(),
          };
          
          const savedPaidOrders = localStorage.getItem('paidOrders');
          const paidOrders = savedPaidOrders ? JSON.parse(savedPaidOrders) : [];
          paidOrders.unshift(paidOrder); // Adicionar no início
          localStorage.setItem('paidOrders', JSON.stringify(paidOrders));
          
          // Inicializar tracking do pedido
          const deliveryNames = ['M.Souza', 'J.Silva', 'R.Santos', 'A.Costa', 'P.Oliveira', 'C.Pereira', 'L.Alves', 'F.Lima'];
          const randomName = deliveryNames[Math.floor(Math.random() * deliveryNames.length)];
          
          const trackingState = {
            startTime: Date.now(),
            initialTime: 30,
            deliveryPerson: randomName,
            transactionId: transactionId,
          };
          
          localStorage.setItem('orderTrackingState', JSON.stringify(trackingState));
          
          // Disparar conversão do Google Ads (antigo)
          reportConversion(
            totalWithTip, // Valor em reais
            transactionId // ID da transação
          );
          
          // Disparar conversão AW-17707310232 (novo) usando função oficial
          gtag_report_conversion(totalWithTip, transactionId);
          
          // Limpar carrinho após pagamento confirmado
          clearCart();
          
          // Redirecionar para página de pedidos após 5 segundos
          setTimeout(() => {
            router.push('/pedidos');
          }, 5000);
        }
      } catch (error) {
        console.error('Erro ao verificar status:', error);
      }
    };

    // Verificar imediatamente
    checkStatus();

    // Depois verificar a cada 10 segundos
    interval = setInterval(checkStatus, 10000);

    // Limpar após 30 minutos (tempo de expiração do PIX)
    setTimeout(() => {
      if (interval) clearInterval(interval);
      localStorage.removeItem('pendingOrder');
    }, 30 * 60 * 1000);

    // Retornar função de limpeza
    return () => {
      if (interval) clearInterval(interval);
    };
  };

  const copyPixCode = () => {
    // Função vazia, o componente PixPayment já gerencia a cópia
  };

  const handleTestPayment = () => {
    // Simular pagamento aprovado (apenas para testes em localhost)
    setIsPaid(true);
    
    const transactionId = Date.now().toString();
    
    // Salvar pedido pago
    const paidOrder = {
      transactionId: transactionId,
      pixCode: pixCode,
      amount: totalPrice * 100,
      items: items,
      status: 'paid' as const,
      paidAt: Date.now(),
    };
    
    const savedPaidOrders = localStorage.getItem('paidOrders');
    const paidOrders = savedPaidOrders ? JSON.parse(savedPaidOrders) : [];
    paidOrders.unshift(paidOrder);
    localStorage.setItem('paidOrders', JSON.stringify(paidOrders));
    
    // Limpar pedido pendente
    localStorage.removeItem('pendingOrder');
    
    // Disparar conversão AW-17707310232 usando função oficial
    gtag_report_conversion(totalPrice, transactionId);
    
    // Limpar carrinho
    clearCart();
    
    alert('✅ Pagamento simulado com sucesso! Redirecionando para pedidos...');
    
    // Redirecionar para página de pedidos após 2 segundos
    setTimeout(() => {
      router.push('/pedidos');
    }, 2000);
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Loading Overlay */}
      {isConfirming && <LoadingOverlay />}
      
      {/* Modal de Recuperação de Pedido */}
      <RecoverOrderModal
        isOpen={showRecoverModal}
        onContinue={handleContinueOrder}
        onStartNew={handleStartNewOrder}
      />
      
      {/* Header Vermelho iFood */}
      <div className="bg-[#f02f2f] mb-3">
        <div className="mx-auto max-w-2xl lg:max-w-7xl py-4 pb-4 px-4 flex justify-center">
          <Image
            src="/backgroundCheckout.png"
            alt="Ifood Delivery"
            width={150}
            height={40}
            className="max-w-[130px] md:max-w-[150px]"
          />
        </div>
      </div>

      <div className="mx-auto max-w-2xl relative px-0 pb-10 lg:max-w-7xl md:mb-10">
        <form className="lg:grid lg:grid-cols-3 lg:gap-x-8 lg:px-7 relative px-0 md:px-3.5">
          
          {/* Resumo Mobile (Colapsável) */}
          <div className="h-auto mt-4 mb-6 lg:hidden">
            <div className="border border-gray-200 mx-3.5 bg-white rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setShowSummary(!showSummary)}
                className="bg-[#E4E8EC] w-full p-3.5"
              >
                <div className="justify-between flex">
                  <h2 className="text-sm md:text-lg font-medium text-slate-900 -mb-2 w-full">
                    <span className="w-full flex">Resumo ({totalItems})</span>
                    <span className="text-xs text-slate-500">Informações da sua compra</span>
                  </h2>
                  <span className="font-bold flex items-center text-sm">
                    R$ {totalPrice.toFixed(2).replace('.', ',')}
                    <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showSummary ? 'rotate-180' : ''}`} />
                  </span>
                </div>
              </button>
              
              {/* Lista de Itens Expandida */}
              {showSummary && (
                <div className="p-4 border-t border-gray-200">
                  <ul className="divide-y divide-slate-200">
                    {items.map((item) => (
                      <li key={item.id} className="flex py-3">
                        <div className="flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={60}
                            height={60}
                            className="w-16 rounded-md object-cover"
                          />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <h4 className="text-xs font-normal text-slate-700">
                            {item.name}
                          </h4>
                          <p className="mt-1 text-xs text-slate-500">Qtd: {item.quantity}</p>
                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            R$ {item.price.toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Total</span>
                      <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {/* Dados Pessoais - Esconder na etapa de pagamento */}
            {currentStep !== "payment" && (
            <div className="border border-gray-200 p-4 md:p-7 bg-white rounded-lg max-sm:rounded-none mb-5">
              <h2 className="text-lg font-medium text-slate-900 flex justify-between">
                <span className="flex gap-1 items-center">Dados pessoais</span>
              </h2>
              <p className="text-xs mt-1 text-slate-900 pb-5">
                Pedimos apenas as informações essenciais para concluir sua compra com segurança.
              </p>

              <div className="space-y-3">
                {/* Nome Completo */}
                <div>
                  <label className="text-[13px] font-medium" htmlFor="name">
                    Nome completo
                  </label>
                  <div className="mt-1 relative">
                    <input
                      className="flex h-[46px] w-full border border-gray-200 px-3 py-1 text-[12px] rounded-lg bg-slate-100"
                      id="name"
                      type="text"
                      value={userData?.name || ""}
                      readOnly
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-5 h-5 absolute right-3 top-3 text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* E-mail */}
                <div>
                  <label className="text-[13px] font-medium" htmlFor="email">
                    E-mail
                  </label>
                  <div className="mt-1 relative">
                    <input
                      className="flex h-[46px] w-full border border-gray-200 px-3 py-1 text-[12px] rounded-lg bg-slate-100"
                      id="email"
                      type="email"
                      value={userData?.email || ""}
                      readOnly
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      className="w-5 h-5 absolute right-3 top-3 text-green-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* CPF e Telefone */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-[13px] font-medium" htmlFor="cpf">
                      <span className="flex gap-1 items-center">
                        CPF
                        <Info className="w-4 h-4 ml-1" />
                      </span>
                    </label>
                    <div className="mt-1 relative">
                      <input
                        className="flex h-[46px] w-full border border-gray-200 px-3 py-1 text-[12px] rounded-lg bg-white"
                        id="cpf"
                        placeholder="000.000.000-00"
                        type="text"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[13px] font-medium" htmlFor="phone">
                      Celular/Whatsapp
                    </label>
                    <div className="relative mt-1">
                      <div className="absolute inset-y-0 left-0 flex items-center">
                        <span className="h-full rounded-md py-3 pl-3 pr-7 text-slate-500 text-sm">
                          +55
                        </span>
                      </div>
                      <input
                        className="flex h-[46px] w-full border border-gray-200 px-3 py-1 text-[12px] rounded-lg bg-white pl-12"
                        id="phone"
                        placeholder="(00) 00000-0000"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Botão Continuar */}
                {currentStep === "personal" && (
                  <button
                    type="button"
                    onClick={handleContinueFromPersonal}
                    className="w-full h-14 mt-5 flex justify-center items-center rounded-lg bg-[#f02f2f] text-white font-bold text-base hover:bg-[#f02f2f]/90"
                  >
                    Continuar
                    <ChevronRight className="w-5 h-5 ml-1 mt-1" />
                  </button>
                )}
              </div>
            </div>
            )}

            {/* Opção de Entrega */}
            {currentStep === "delivery" && (
              <DeliveryOptions onConfirm={handleContinueFromDelivery} />
            )}

            {/* Resumo do Pedido */}
            {currentStep === "summary" && (
              <>
                {/* Oferta de Água - Só mostra se não tiver água no carrinho */}
                {!items.some(item => item.productId === "agua-500ml") && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-5 mb-5 border-2 border-blue-200 max-sm:rounded-none">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src="/products/1_agua.png"
                        alt="Água Mineral"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">
                        💧 Que tal uma água geladinha?
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        Perfeito para acompanhar seu açaí! Água Mineral 500ml
                      </p>
                      <p className="text-xs text-blue-700 font-semibold">
                        ✨ Apenas R$ 2,50 cada
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        addItem({
                          id: Date.now().toString(),
                          productId: "agua-500ml",
                          name: "Água Mineral 500ml",
                          price: 2.50,
                          quantity: 1,
                          image: "/products/1_agua.png",
                        });
                      }}
                      className="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">💧</span>
                      <span>Adicionar 1</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        addItem({
                          id: Date.now().toString(),
                          productId: "agua-500ml",
                          name: "Água Mineral 500ml",
                          price: 2.50,
                          quantity: 2,
                          image: "/products/1_agua.png",
                        });
                      }}
                      className="flex-1 py-3 px-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="text-lg">💧💧</span>
                      <span>Adicionar 2</span>
                    </button>
                  </div>
                </div>
                )}

                <OrderSummary 
                  items={items}
                  totalPrice={totalPrice}
                  deliveryData={deliveryData}
                  onConfirm={handleConfirmOrder}
                  onRemoveItem={removeItem}
                  onTipChange={setTip}
                />
              </>
            )}

            {/* Tela de Pagamento PIX */}
            {currentStep === "payment" && (
              <PixPayment 
                pixCode={pixCode}
                pixQrCode={pixQrCode}
                onCopy={copyPixCode}
                isPaid={isPaid}
                onTestPayment={handleTestPayment}
              />
            )}

          </div>

          {/* Resumo Desktop (Sidebar) */}
          <div className="h-auto hidden lg:block">
            <div className="border border-gray-200 p-4 md:p-6 bg-white rounded-lg">
              <h2 className="text-lg font-medium text-slate-900">Resumo do pedido</h2>

              <div className="mt-5">
                <ul role="list" className="divide-y divide-slate-200">
                  {items.map((item) => (
                    <li key={item.id} className="flex py-3">
                      <div className="flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-20 rounded-md object-cover"
                        />
                      </div>
                      <div className="ml-6 flex flex-1 flex-col">
                        <div className="flex">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm flex justify-between">
                              <span className="font-normal text-slate-700 text-xs">
                                {item.name}
                              </span>
                            </h4>
                            <p className="mt-1 text-xs text-slate-500 font-semibold">
                              <span className="text-sm text-slate-800">
                                R$ {item.price.toFixed(2).replace('.', ',')}
                              </span>
                            </p>
                            <div className="w-20 mt-3">
                              <select className="rounded-md border border-gray-200 text-center text-base font-medium text-slate-700 w-full h-7 text-sm">
                                {[...Array(20)].map((_, i) => (
                                  <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <hr className="border-t border-gray-200 mt-3 mb-4" />
              </div>

              {/* Cupom */}
              <div className="mt-5 my-3">
                <label className="text-[13px] font-medium">Tem um cupom?</label>
                <div className="flex justify-between gap-3 mt-2">
                  <input
                    className="flex w-full border border-gray-200 px-3 py-1 text-[12px] h-10 rounded-lg"
                    placeholder="Digite o cupom"
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    type="button"
                    className="w-full max-w-24 h-10 flex justify-center items-center text-xs rounded-lg bg-[#f02f2f] text-white font-bold hover:bg-[#f02f2f]/90"
                  >
                    Adicionar
                  </button>
                </div>
              </div>

              <hr className="border-t border-gray-200 mb-5 mt-6" />

              {/* Total */}
              <dl className="space-y-3 text-slate-500 bg-gray-100 p-5 mb-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <dt className="text-[12px]">Subtotal</dt>
                  <dd className="text-[12px] text-slate-900">
                    R$ {totalPrice.toFixed(2).replace('.', ',')}
                  </dd>
                </div>
                <div className="flex items-center justify-between pt-6">
                  <dt className="text-[14px] font-semibold">Total</dt>
                  <dd className="text-[14px] font-semibold text-slate-900">
                    R$ {totalPrice.toFixed(2).replace('.', ',')}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </form>
      </div>

      {/* Footer Preto */}
      <div className="bg-black text-white shadow-sm p-8">
        <div className="mx-auto max-w-2xl lg:max-w-7xl relative px-5 pb-10">
          <div className="flex justify-between items-center gap-3 text-xs flex-col text-center md:flex-row md:text-left">
            <div></div>
            <div>
              <div className="flex mt-10 md:mt-0">
                <div className="flex items-center">
                  <LockKeyhole className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-[9px] leading-[.65rem] md:text-xs md:leading-[13px]">
                    <b>PAGAMENTO</b>
                    <br /> 100% SEGURO
                  </span>
                </div>
              </div>
            </div>
          </div>
          <hr className="mt-5 mb-7 opacity-60" />
          <div className="flex justify-center items-center flex-col gap-3 text-xs">
            <p className="w-full text-center my-4">
              Ifood Delivery | Todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
