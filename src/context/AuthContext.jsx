import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // ✅ Correct import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [logoutTimer, setLogoutTimer] = useState(null);

// Sync logout/login across tabs
  useEffect(() => {
    const syncAuth = (event) => {
      if (event.key === 'user') {
        // When 'user' key changes, update state
        if (event.newValue) {
          setUser(JSON.parse(event.newValue));
        } else {
          // user was removed = logout happened in another tab
          setUser(null);
          setToken(null);
          if (logoutTimer) clearTimeout(logoutTimer);
        }
      }
      if (event.key === 'token') {
        if (event.newValue) {
          setToken(event.newValue);
        } else {
          setToken(null);
        }
      }
    };

    window.addEventListener('storage', syncAuth);

    return () => {
      window.removeEventListener('storage', syncAuth);
    };
  }, [logoutTimer]);

  useEffect(() => {
    if (token && user?.role === 'customer') {
      try {
        const decoded = jwtDecode(token); // ✅ Correct usage
        const now = Date.now() / 1000;
        const timeLeft = decoded.exp - now;

        if (timeLeft <= 0) {
          logout();
        } else {
          const timer = setTimeout(() => {
            console.log('⏳ Token expired. Logging out automatically...');
            logout();
          }, timeLeft * 1000);

          setLogoutTimer(timer);
          console.log(`⏰ Auto-logout scheduled in ${Math.round(timeLeft)} seconds`);
        }
      } catch (err) {
        console.error('Invalid token:', err);
        logout(); // fallback
      }
    }

    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, [token]);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
    setUser(userData);
    setToken(userData.token);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    if (logoutTimer) clearTimeout(logoutTimer);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
