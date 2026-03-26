import { createContext, type ReactNode, useState, useEffect } from 'react';

interface User {
  usuariId: number;
  nom: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

interface Props {
  children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  // Inicializa desde localStorage para que la sesión persista entre recargas
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Cada vez que el usuario cambia, sincroniza con localStorage
  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem('user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('user');
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};