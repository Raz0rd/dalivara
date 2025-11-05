"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AddressData {
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement: string;
}

interface UserData {
  whatsapp?: string;
  name?: string;
  email?: string;
  address?: AddressData;
}

interface UserContextType {
  userData: UserData | null;
  setUserData: (data: UserData) => void;
  clearUserData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = "nacional_acai_user";

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserDataState] = useState<UserData | null>(null);

  useEffect(() => {
    // Carregar dados do localStorage ao iniciar
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setUserDataState(JSON.parse(stored));
    }
  }, []);

  const setUserData = (data: UserData) => {
    setUserDataState(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const clearUserData = () => {
    setUserDataState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <UserContext.Provider value={{ userData, setUserData, clearUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
