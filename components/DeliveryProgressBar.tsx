"use client";

interface DeliveryProgressBarProps {
  isPaid: boolean;
}

export default function DeliveryProgressBar({ isPaid }: DeliveryProgressBarProps) {
  const now = new Date();
  const startTime = new Date(now.getTime());
  const endTime = new Date(now.getTime() + 30 * 60 * 1000); // +30 minutos

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-gray-900 text-white rounded-lg p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#f02f2f] rounded-full flex items-center justify-center">
            <span className="text-xl">🏍️</span>
          </div>
          <span className="font-semibold">iFood • 30min</span>
        </div>
        <button className="text-white">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 15l-6-6-6 6"/>
          </svg>
        </button>
      </div>

      {/* Previsão de entrega */}
      <div className="mb-3">
        <p className="text-sm text-gray-400 mb-1">Previsão de entrega</p>
        <p className="text-2xl font-bold">
          {formatTime(startTime)} - {formatTime(endTime)}
        </p>
      </div>

      {/* Barra de progresso */}
      <div className="mb-4">
        <div className="flex gap-1 mb-2">
          {/* Pedido confirmado */}
          <div className="flex-1 h-1 bg-green-500 rounded-full"></div>
          {/* Preparando */}
          <div className={`flex-1 h-1 rounded-full ${isPaid ? 'bg-green-500' : 'bg-gray-600'}`}></div>
          {/* Saiu para entrega */}
          <div className="flex-1 h-1 bg-gray-600 rounded-full"></div>
          {/* Entregue */}
          <div className="flex-1 h-1 bg-gray-600 rounded-full"></div>
        </div>
      </div>

      {/* Status atual */}
      <div className="bg-gray-800 rounded-lg p-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#f02f2f] rounded flex items-center justify-center">
          <span className="text-2xl">🍽️</span>
        </div>
        <div>
          <p className="font-bold text-base">Pedido sendo preparado</p>
          <p className="text-sm text-gray-400">Seu pedido está sendo preparado com carinho</p>
        </div>
      </div>
    </div>
  );
}
