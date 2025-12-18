"use client";

import { useEffect } from "react";
import { CheckCircle, X, AlertCircle } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const bgColor = type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-blue-600";
  const Icon = type === "success" ? CheckCircle : AlertCircle;

  return (
    <div className="fixed top-4 left-4 right-4 z-[9999] flex justify-center animate-slide-down">
      <div className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md w-full`}>
        <div className="flex-shrink-0">
          <Icon size={20} color="white" strokeWidth={2} />
        </div>
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors"
          aria-label="Fechar"
        >
          <X size={18} color="white" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
