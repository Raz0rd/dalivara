import { useState, useEffect } from "react";

interface LocationData {
  city: string;
  region: string;
  country: string;
  deliveryTime: string;
  confirmed: boolean;
}

const STORAGE_KEY = "nacional_acai_location";
const API_TOKEN = "32090226b9d116";

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tempLocation, setTempLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    const loadLocation = async () => {
      // Verificar se já tem localização salva
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setLocation(data);
        return;
      }

      // Buscar localização da API em background
      try {
        const response = await fetch(`https://ipinfo.io/?token=${API_TOKEN}`);
        const data = await response.json();

        // Gerar tempo de entrega aleatório entre 10 e 20 minutos
        const minTime = 10;
        const maxTime = 20;
        const deliveryTime = `${minTime}~${maxTime}`;

        const locationData: LocationData = {
          city: data.city || "Sua cidade",
          region: data.region || "",
          country: data.country || "",
          deliveryTime,
          confirmed: false,
        };

        setTempLocation(locationData);
        setShowConfirmation(true);
      } catch (error) {
        console.error("Erro ao buscar localização:", error);
        // Localização padrão em caso de erro
        const defaultLocation: LocationData = {
          city: "Sua cidade",
          region: "",
          country: "",
          deliveryTime: "10~20",
          confirmed: false,
        };
        setTempLocation(defaultLocation);
        setShowConfirmation(true);
      }
    };

    loadLocation();
  }, []);

  const confirmLocation = () => {
    if (tempLocation) {
      const confirmedLocation = { ...tempLocation, confirmed: true };
      setLocation(confirmedLocation);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(confirmedLocation));
      setShowConfirmation(false);
      setTempLocation(null);
    }
  };

  const changeLocation = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLocation(null);
    setLoading(true);
    window.location.reload();
  };

  return {
    location,
    loading,
    showConfirmation,
    tempLocation,
    confirmLocation,
    changeLocation,
  };
}
