"use client";

import { useState } from "react";
import { Calendar, Clock, ChevronRight } from "lucide-react";

interface DeliveryOptionsProps {
  onConfirm?: (data: { type: string; date?: string; time?: string }) => void;
}

export default function DeliveryOptions({ onConfirm }: DeliveryOptionsProps) {
  const [deliveryType, setDeliveryType] = useState<"immediate" | "scheduled">("immediate");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm({
        type: deliveryType,
        date: deliveryType === "scheduled" ? selectedDate : undefined,
        time: deliveryType === "scheduled" ? selectedTime : undefined,
      });
    }
  };

  const canConfirm = deliveryType === "immediate" || (deliveryType === "scheduled" && selectedDate && selectedTime);

  // Gerar próximos 7 dias
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  // Gerar horários disponíveis
  const getAvailableTimes = (date: Date) => {
    const times = [];
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      // Hoje: a partir de 2h da hora atual
      const minHour = now.getHours() + 2;
      for (let hour = minHour; hour < 22; hour++) {
        times.push(`${String(hour).padStart(2, '0')}:00 às ${String(hour + 1).padStart(2, '0')}:00`);
      }
    } else {
      // Outros dias: das 8h às 22h
      for (let hour = 8; hour < 22; hour++) {
        times.push(`${String(hour).padStart(2, '0')}:00 às ${String(hour + 1).padStart(2, '0')}:00`);
      }
    }
    
    return times;
  };

  // Verificar se o dia tem horários disponíveis
  const hasAvailableTimes = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      const minHour = now.getHours() + 2;
      return minHour < 22; // Tem horários se ainda não passou das 20h (20h + 2h = 22h)
    }
    
    return true; // Outros dias sempre têm horários
  };

  const formatDate = (date: Date) => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    return {
      dayName: days[date.getDay()],
      day: date.getDate(),
      month: months[date.getMonth()],
      fullDate: date.toISOString().split('T')[0]
    };
  };

  const availableDates = getAvailableDates();
  const availableTimes = selectedDate ? getAvailableTimes(new Date(selectedDate)) : [];

  return (
    <div className="border border-gray-200 p-4 md:p-7 bg-white rounded-lg max-sm:rounded-none mt-5">
      <h2 className="text-lg font-medium text-slate-900">
        <span className="flex gap-1 items-center">Opção de entrega</span>
      </h2>
      <p className="text-xs mt-1 text-slate-500 pb-5">
        Escolha quando deseja receber seu pedido
      </p>

      {/* Tipo de Entrega */}
      <div className="space-y-3">
        {/* Entrega Imediata */}
        <div
          onClick={() => setDeliveryType("immediate")}
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            deliveryType === "immediate"
              ? "border-[#f02f2f] bg-red-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  deliveryType === "immediate"
                    ? "border-[#f02f2f]"
                    : "border-gray-300"
                }`}
              >
                {deliveryType === "immediate" && (
                  <div className="w-3 h-3 rounded-full bg-[#f02f2f]"></div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Entrega Imediata</p>
                <p className="text-xs text-slate-500">Receba em até 30 minutos</p>
              </div>
            </div>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* Entrega Agendada */}
        <div
          onClick={() => setDeliveryType("scheduled")}
          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
            deliveryType === "scheduled"
              ? "border-[#f02f2f] bg-red-50"
              : "border-gray-200 bg-white hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  deliveryType === "scheduled"
                    ? "border-[#f02f2f]"
                    : "border-gray-300"
                }`}
              >
                {deliveryType === "scheduled" && (
                  <div className="w-3 h-3 rounded-full bg-[#f02f2f]"></div>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Entrega Agendada</p>
                <p className="text-xs text-slate-500">Escolha data e horário</p>
              </div>
            </div>
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Calendário e Horários (apenas se agendada) */}
      {deliveryType === "scheduled" && (
        <div className="mt-5 space-y-4">
          {/* Seleção de Data */}
          <div>
            <label className="text-[13px] font-medium mb-2 block">
              Escolha a data
            </label>
            <div className="grid grid-cols-4 gap-2">
              {availableDates.map((date) => {
                const formatted = formatDate(date);
                const isSelected = selectedDate === formatted.fullDate;
                const isAvailable = hasAvailableTimes(date);
                
                return (
                  <button
                    key={formatted.fullDate}
                    type="button"
                    onClick={() => {
                      if (isAvailable) {
                        setSelectedDate(formatted.fullDate);
                        setSelectedTime("");
                      }
                    }}
                    disabled={!isAvailable}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      !isAvailable
                        ? "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                        : isSelected
                        ? "border-[#f02f2f] bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <p className={`text-[10px] ${!isAvailable ? "text-gray-400" : "text-slate-500"}`}>
                      {formatted.dayName}
                    </p>
                    <p className={`text-lg font-bold ${!isAvailable ? "text-gray-400" : "text-slate-900"}`}>
                      {formatted.day}
                    </p>
                    <p className={`text-[10px] ${!isAvailable ? "text-gray-400" : "text-slate-500"}`}>
                      {formatted.month}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seleção de Horário */}
          {selectedDate && (
            <div>
              <label className="text-[13px] font-medium mb-2 block">
                Escolha o horário
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                {availableTimes.map((time) => {
                  const isSelected = selectedTime === time;
                  
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        isSelected
                          ? "border-[#f02f2f] bg-red-50 text-[#f02f2f]"
                          : "border-gray-200 text-slate-700 hover:border-gray-300"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Botão Confirmar */}
      {onConfirm && (
        <button
          type="button"
          onClick={handleConfirm}
          disabled={!canConfirm}
          className={`w-full h-14 mt-5 flex justify-center items-center rounded-lg font-bold text-base transition-colors ${
            canConfirm
              ? "bg-[#f02f2f] text-white hover:bg-[#f02f2f]/90"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Confirmar Entrega
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      )}
    </div>
  );
}
