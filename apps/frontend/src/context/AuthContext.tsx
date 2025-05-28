import { createContext } from 'react';

type User = {
  id: number;
  username: string;
  email: string;
};

type AuthContextType = {
  // user: User | null;
  // setUser: (user: User | null) => void;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  refreshUser: () => Promise<void>;
  logout: () => void;
  loading: boolean;
  visitedBefore: boolean;
  setVisitedBefore: React.Dispatch<React.SetStateAction<boolean>>;
  handleLoginSuccess: (userData: User, token: string) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
