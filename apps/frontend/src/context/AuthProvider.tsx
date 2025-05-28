import React, { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { BACKEND_URL } from '../config';

type User = {
  id: number;
  username: string;
  email: string;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Initialize from localStorage or false
  const [visitedBefore, setVisitedBefore] = useState(() => {
    const visited = localStorage.getItem('visitedBefore');
    return visited === 'true'; // false if null or anything else
  });

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // DO NOT reset visitedBefore here
  }, []);

  const [loading, setLoading] = useState(true);

  // Refresh user on app load
  const refreshUser = useCallback(async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/user/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const freshUser = await res.json();
        setUser(freshUser);
        localStorage.setItem("user", JSON.stringify(freshUser));
        // Since user is logged in, mark visitedBefore true
        setVisitedBefore(true);
        localStorage.setItem('visitedBefore', 'true');
      } else {
        logout();
      }
    } catch (err) {
      console.error("refreshUser error:", err);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) refreshUser();
    else setLoading(false);
  }, [refreshUser]);

  // You may want a helper to set visitedBefore to true after signin/signup success
  const handleLoginSuccess = (userData: User, token: string) => {
    setUser(userData); // setting user, email and passwork -> needed for sidebar profile 
    // before i was using useAuth to use setUser
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);

    setVisitedBefore(true);
    localStorage.setItem('visitedBefore', 'true');
  };

  // Sync visitedBefore state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('visitedBefore', visitedBefore ? 'true' : 'false');
  }, [visitedBefore]);

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      refreshUser,
      logout,
      loading,
      visitedBefore,
      setVisitedBefore,
      handleLoginSuccess  // expose to your login/signup components
    }}>
      {children}
    </AuthContext.Provider>
  );
};


// import React, { useState, useEffect, useCallback } from 'react';
// import { AuthContext } from './AuthContext';
// import { BACKEND_URL } from '../config';

// type User = {
//   id: number;
//   username: string;
//   email: string;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);

//   // New visitedBefore state, initialized from localStorage
//   const [visitedBefore, setVisitedBefore] = useState(() => {
//     const visited = localStorage.getItem('visitedBefore');
//     return visited === 'true';  // default false if not set
//   });

//   const logout = useCallback(() => {
//     setUser(null);
//     localStorage.removeItem('user');
//     localStorage.removeItem('token');
//   }, []);

//   const [loading, setLoading] = useState(true);

//   const refreshUser = useCallback(async () => {
//     setLoading(true);
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setLoading(false);
//       return;
//     }
//     try {
//       const res = await fetch(`${BACKEND_URL}/api/v1/user/me`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.ok) {
//         const freshUser = await res.json();
//         setUser(freshUser);
//         localStorage.setItem("user", JSON.stringify(freshUser));
//       } else {
//         logout();
//       }
//     } catch (err) {
//       console.error("refreshUser error:", err);
//       logout();
//     } finally {
//       setLoading(false);
//     }
//   }, [logout]);

//   useEffect(() => {
//     refreshUser();
//   }, [refreshUser]);

//   // When visitedBefore changes, sync to localStorage
//   useEffect(() => {
//     localStorage.setItem('visitedBefore', visitedBefore ? 'true' : 'false');
//   }, [visitedBefore]);



//   return (
//     <AuthContext.Provider value={{ user, setUser, refreshUser, logout, loading, visitedBefore, setVisitedBefore }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
