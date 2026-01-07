"use client";

import { useState, useEffect } from "react";
import { Star, StarHalf } from "lucide-react";
import Image from "next/image";

interface Review {
  name: string;
  rating: number;
  comment: string;
  image: string;
}

export default function ReviewsSection() {
  const [timeLeft, setTimeLeft] = useState({ minutes: 9, seconds: 0 });

  useEffect(() => {
    // Verificar se já existe um timer salvo
    const savedEndTime = localStorage.getItem("promo_end_time");
    let endTime: number;

    if (savedEndTime) {
      endTime = parseInt(savedEndTime);
    } else {
      // Criar novo timer de 9 minutos
      endTime = Date.now() + 9 * 60 * 1000; // 9 minutos em ms
      localStorage.setItem("promo_end_time", endTime.toString());
    }

    const updateTimer = () => {
      const now = Date.now();
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft({ minutes: 0, seconds: 0 });
        return;
      }

      const minutes = Math.floor(difference / 1000 / 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimeLeft({ minutes, seconds });
    };

    // Atualizar imediatamente
    updateTimer();

    // Atualizar a cada segundo
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);
  const reviews: Review[] = [
    { name: "Laysa", rating: 5, comment: "Chegou geladinho, bem embalado e do jeito que pedi.", image: "/products/reviews/img30.jpg" },
    { name: "Nadia", rating: 5, comment: "Sinceramente? Melhor custo-benefício que já vi! Açaí bom, preço sensacional e entrega rápida.", image: "/products/reviews/img21.jpg" },
    { name: "Aline", rating: 5, comment: "Pedi pra testar e agora já viciei kkk", image: "/products/reviews/img25.jpg" },
    { name: "Kamilly", rating: 5, comment: "Quando vi o preço achei q ia ser pequeno, mas me enganei! Vem bem servido e a qualidade é absurda.", image: "/products/reviews/img4.webp" },
    { name: "Karol", rating: 5, comment: "entregaram dentro do prazo e o açaí é delicioso! Vou pedir mais loguinhoo", image: "/products/reviews/img15.jpg" },
    { name: "Talita", rating: 5, comment: "Açaí cremoso, bem montado e chegou intacto. Parabéns a franquia.", image: "/products/reviews/img16.jpg" },
    { name: "Aline", rating: 5, comment: "Bom, barato e entrega rápida. Não tem erro, semana que vem peço de novo", image: "/products/reviews/img23.jpg" },
    { name: "Iana", rating: 5, comment: "Pedi pela primeira vez e td mundo gostou, vamos pedir mais!", image: "/products/reviews/img7.jpg" },
    { name: "Gustavo", rating: 5, comment: "Açaí top, amei", image: "/products/reviews/img8.jpg" },
    { name: "Iana", rating: 5, comment: "Gostei muito Sério kkk", image: "/products/reviews/img9.jpg" },
    { name: "Mari", rating: 5, comment: "Muito bom, esta de parabéns", image: "/products/reviews/img22.jpg" },
    { name: "Ana", rating: 5, comment: "Me deram um pacotinho de Bala Fini de Brinde no primeiro pedido escrito \"para adoçar seu dia\", ameiiii nota 10!!!!", image: "/products/reviews/img26.jpg" },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={14} className="fill-yellow-500 text-yellow-500" />);
    }
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" size={14} className="fill-yellow-500 text-yellow-500" />);
    }
    return stars;
  };

  return (
    <div className="bg-white mb-2">
      {/* Header de Avaliações */}
      <div className="bg-gray-50 border-y border-gray-200 px-4 py-4 text-center">
        <div className="mb-2">
          <span className="text-3xl font-bold text-gray-900">4,8</span>
        </div>
        <div className="flex items-center justify-center gap-1 mb-2">
          {renderStars(4.5)}
        </div>
        <p className="text-sm font-semibold text-gray-900 mb-1">
          <strong>136 avaliações</strong> • últimos 90 dias
        </p>
        <p className="text-xs text-gray-500">1.007 avaliações no total</p>
      </div>

      {/* Lista de Avaliações */}
      <div className="divide-y divide-gray-200">
        {reviews.map((review, index) => (
          <div key={index} className="flex items-start gap-3 p-4">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">{review.name}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-bold text-sm text-gray-900">{review.rating.toFixed(1)}</span>
                <div className="flex gap-0.5">
                  {renderStars(review.rating)}
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
            <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={review.image}
                alt={`Avaliação de ${review.name}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
