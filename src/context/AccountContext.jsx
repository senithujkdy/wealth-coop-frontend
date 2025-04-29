import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AccountContext = createContext();

export const AccountProvider = ({ children }) => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch accounts when user logs in
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!user) return;

      try {
        const res = await fetch(`http://localhost:3000/api/accounts/user/${user.user_id}`);
        const data = await res.json();
        console.log('📦 Accounts Data from Context:', data);
        setAccounts(data.accounts || []);
      } catch (error) {
        console.error('🚨 AccountContext: Failed to fetch accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [user]);

  return (
    <AccountContext.Provider value={{ accounts, loading }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => useContext(AccountContext);
