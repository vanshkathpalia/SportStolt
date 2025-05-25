// AuthContext.tsx (your final version)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { BACKEND_URL } from '../config';

type User = {
  id: number;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/user/me`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const freshUser = await res.json();
        setUser(freshUser);
        localStorage.setItem('user', JSON.stringify(freshUser));
      } else {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.error('refreshUser error:', err);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};


// // this may work in deploy env too 
// // was working but we need something else ik 
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { BACKEND_URL } from '../config';

// type User = {
//   id: number;
//   username: string;
//   email: string;
// };

// type AuthContextType = {
//   user: User | null;
//   setUser: (user: User | null) => void;
//   refreshUser: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(() => {
//     const stored = localStorage.getItem('user');
//     return stored ? JSON.parse(stored) : null;
//   });

//   // Helper to refresh user manually
//   const refreshUser = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     try {
//       const res = await fetch(`${BACKEND_URL}/api/v1/user/me`, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.ok) {
//         const freshUser = await res.json();
//         setUser(freshUser);
//         localStorage.setItem('user', JSON.stringify(freshUser));
//       } else {
//         setUser(null);
//         localStorage.removeItem('user');
//         localStorage.removeItem('token');
//       }
//     } catch (err) {
//       console.error('refreshUser error:', err);
//     }
//   };

//   // Fetch user if token is present (run once on mount)
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       refreshUser();
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser, refreshUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return ctx;
// };

// // in dev env... but working fine in deploy env... it is because in deploy env getting /me is late that already stored local storage so vercel use ls 
// // issue with token having prev user data for profile
// // until and unless i refresh
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { BACKEND_URL } from '../config';

// type User = {
//   id: number;
//   username: string;
//   email: string;
// };

// type AuthContextType = {
//   user: User | null;
//   setUser: (user: User | null) => void;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);

//   // Load user from localStorage initially
//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // Then fetch fresh user data from /me endpoint if token exists
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) return;

//     async function fetchUser() {
//       try {
//         const res = await fetch(`${BACKEND_URL}/api/v1/user/me`, {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (res.ok) {
//           const data = await res.json();
//           setUser(data);
//           localStorage.setItem('user', JSON.stringify(data)); // update localStorage with fresh user
//         } else {
//           // Unauthorized or error - clear user and localStorage
//           setUser(null);
//           localStorage.removeItem('user');
//           localStorage.removeItem('token');
//         }
//       } catch (error) {
//         console.error('Failed to fetch user:', error);
//         setUser(null);
//         localStorage.removeItem('user');
//         localStorage.removeItem('token');
//       }
//     }

//     fetchUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return ctx;
// };
