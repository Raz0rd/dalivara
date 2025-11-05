"use client";

interface RecoverOrderModalProps {
  isOpen: boolean;
  onContinue: () => void;
  onStartNew: () => void;
}

export default function RecoverOrderModal({
  isOpen,
  onContinue,
  onStartNew,
}: RecoverOrderModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        {/* Ícone */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <span className="text-3xl">⏰</span>
          </div>
        </div>

        {/* Título */}
        <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
          Pedido em Andamento
        </h3>

        {/* Descrição */}
        <p className="text-sm text-gray-600 text-center mb-6">
          Você tem um pedido aguardando pagamento. Deseja continuar de onde parou ou começar um novo pedido?
        </p>

        {/* Botões */}
        <div className="space-y-3">
          <button
            onClick={onContinue}
            className="w-full py-4 bg-primary text-white font-bold text-base rounded-lg hover:bg-primary/90 transition-colors"
          >
            Continuar Pedido
          </button>
          <button
            onClick={onStartNew}
            className="w-full py-4 border-2 border-gray-300 text-gray-700 font-bold text-base rounded-lg hover:bg-gray-50 transition-colors"
          >
            Começar Novo Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
