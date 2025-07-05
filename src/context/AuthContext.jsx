import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [logoutTimer, setLogoutTimer] = useState(null);
  const [isWindowFocused, setIsWindowFocused] = useState(document.hasFocus());

  // 🔄 Track tab focus status
  useEffect(() => {
    const handleFocus = () => setIsWindowFocused(true);
    const handleBlur = () => setIsWindowFocused(false);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // ⏰ Token expiry auto-logout ONLY when window NOT focused
  useEffect(() => {
    if (token && user?.role === 'customer') {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        const timeLeft = decoded.exp - now;

        if (timeLeft <= 0) {
          logout();
        } else if (!isWindowFocused) {
          // Only auto logout when tab NOT in focus
          const timer = setTimeout(() => {
            console.log('⏳ Token expired while tab not focused. Logging out...');
            logout();
          }, timeLeft * 5000);
          setLogoutTimer(timer);
          console.log(`⏰ Token expiry logout scheduled in ${Math.round(timeLeft)}s`);
        } else {
          console.log('🟢 Token valid, and tab is focused — skipping auto logout');
        }
      } catch (err) {
        console.error('❌ Invalid token:', err);
        logout();
      }
    }

    return () => {
      if (logoutTimer) clearTimeout(logoutTimer);
    };
  }, [token, user, isWindowFocused]);

  // 👋 Logout when tab is unfocused for too long
  useEffect(() => {
    let blurLogoutTimer;

    const handleBlur = () => {
      if (user?.role === 'customer') {
        console.log('👋 Tab lost focus. Scheduling logout...');
        blurLogoutTimer = setTimeout(() => {
          console.log('🔒 Logging out due to tab switch/inactivity');
          logout();
        }, 10000); // logout after 10 seconds unfocused
      }
    };

    const handleFocus = () => {
      if (blurLogoutTimer) {
        console.log('✅ Tab focused again. Canceling blur logout timer');
        clearTimeout(blurLogoutTimer);
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

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
