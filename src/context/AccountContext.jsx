import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch accounts when user logs in
useEffect(() => {
  const fetchAccounts = async () => {
    if (!user || !token) return;

    try {
      const res = await fetch(`http://localhost:3000/api/accounts/user/${user.user_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setAccounts(data.accounts || []);
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchAccounts();
}, [user, token]);

  return (
    <AccountContext.Provider value={{ accounts, loading }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext);
