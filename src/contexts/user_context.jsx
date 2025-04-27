// UserContext.js
import { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const UserContext = createContext();

// Local storage key
const USER_STORAGE_KEY = 'cm_user_data';

// Helper to validate Cameroon phone numbers
const isCameroonPhoneNumber = (phoneNumber) => {
  // Cameroon phone numbers are typically:
  // - +237 followed by 8 digits
  // - 6 followed by 8 digits
  const cmRegex = /^(\+237|237)?[6][0-9]{8}$/;
  return cmRegex.test(phoneNumber);
};

// Format phone number consistently
const formatPhoneNumber = (phoneNumber) => {
  // Strip any non-digits
  const digits = phoneNumber.replace(/\D/g, '');
  
  // If it doesn't start with country code, add it
  if (!digits.startsWith('237')) {
    return `237${digits}`;
  }
  
  return digits;
};

// Create the provider component
export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [user_card, setUserCard] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        console.log("storedUser", storedUser)
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {

  }, [user_card])
  
  // Login function with phone number validation
  const login = (userData) => {
    if (!userData.phoneNumber) {
      throw new Error('Phone number is required');
    }
    
    // Validate Cameroon phone number
    if (!isCameroonPhoneNumber(userData.phoneNumber)) {
      throw new Error('Invalid Cameroon phone number format');
    }
    
    // Format the phone number consistently
    const formattedUserData = {
      ...userData,
      phoneNumber: formatPhoneNumber(userData.phoneNumber)
    };
    
    setUser(formattedUserData);
    // Save to localStorage
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(formattedUserData));
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    // Remove from localStorage
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const gatherUserCarData = (user_card_datas) => {
    setUserCard(user_card_datas);
  }
  
  // Value to be provided to consumers
  const value = {
    user,
    user_card,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    validatePhoneNumber: isCameroonPhoneNumber,
    gatherUserCarData
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for consuming the context
export function useUser() {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  
  return context;
}