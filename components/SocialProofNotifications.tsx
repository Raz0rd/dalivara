"use client";

import { useEffect } from "react";

// Importação dinâmica do SweetAlert2
let Swal: any;

interface Notification {
  message: string;
  icon: string;
}

export default function SocialProofNotifications() {
  useEffect(() => {
    // Importar SweetAlert2 dinamicamente (apenas no cliente)
    import("sweetalert2").then((module) => {
      Swal = module.default;
    });

    // Lista de notificações de prova social
    const notifications: Notification[] = [
      { message: "🔥 Nas últimas 2 horas, 37 pessoas compraram nossos combos de açaí!", icon: "success" },
      { message: "⚡ Maria de São Paulo acabou de fazer um pedido!", icon: "success" },
      { message: "🎉 João do Rio de Janeiro comprou 2 açaís de 1L!", icon: "success" },
      { message: "💜 Ana de Belo Horizonte acabou de pedir um combo!", icon: "success" },
      { message: "🔥 15 pessoas estão vendo este produto agora!", icon: "info" },
      { message: "⭐ Carlos de Brasília deu 5 estrelas para nosso açaí!", icon: "success" },
      { message: "🚀 Últimas 24h: 127 pedidos realizados!", icon: "success" },
      { message: "💚 Paula de Curitiba acabou de fazer um pedido!", icon: "success" },
      { message: "🎊 Pedro de Salvador comprou o combo promocional!", icon: "success" },
      { message: "⚡ Juliana de Fortaleza acabou de pedir açaí zero!", icon: "success" },
    ];

    let currentIndex = 0;
    let timeoutId: NodeJS.Timeout;

    const showNotification = () => {
      if (!Swal) return; // Aguardar carregamento do Swal
      
      const notification = notifications[currentIndex];
      
      Swal.fire({
        toast: true,
        position: "top-right",
        icon: notification.icon as any,
        title: notification.message,
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
        backdrop: false,
        customClass: {
          popup: "toast-mini",
          title: "toast-title-mini",
        },
        didOpen: (toast: any) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      // Próxima notificação
      currentIndex = (currentIndex + 1) % notifications.length;
      
      // Mostrar próxima notificação entre 15-30 segundos
      const nextDelay = Math.random() * 15000 + 15000; // 15-30 segundos
      timeoutId = setTimeout(showNotification, nextDelay);
    };

    // Primeira notificação após 5 segundos
    timeoutId = setTimeout(showNotification, 5000);

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  return null; // Componente não renderiza nada visualmente
}
