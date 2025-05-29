// UserContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import userService from '../services/user_service';
import useApi from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';

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
    // return `237${digits}`;
    return `${digits}`;
  }
  
  return digits;
};

// Create the provider component
export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [user_card, setUserCard] = useState(null);
  const [loading, setLoading] = useState({
    checked: null,
    authenticated: null,
    hasSubscription: null
  });
  
  useEffect(() => {
    console.log("Loading State App", loading)
  }, [loading])
  

  // Check localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        var storedUserObj = JSON.parse(storedUser);
        if(storedUserObj.phoneNumber?.startsWith('237')) {
          storedUserObj.phoneNumber = storedUserObj.phoneNumber.replace("237", '');
        } else if(storedUserObj?.phoneNumber?.startsWith('+237')) {
          storedUserObj.phoneNumber = storedUserObj.phoneNumber.replace("+237", '');
        }
        // Validate the phone number format
        setUser(storedUserObj);
        console.log("storedUser", storedUserObj);
        setLoading({...loading, authenticated: true});
      } catch (error) {
        console.error('Failed to parse user data from localStorage:', error);
        localStorage.removeItem(USER_STORAGE_KEY);
        setLoading({...loading, authenticated: false});
      }
    } else {
      setLoading({...loading, authenticated: false, checked: false})
    }
  }, []);

  useEffect(() => {
      console.log("user_carx", user_card)
  })

  const { execute: getData } = useApi(userService.check_user_card_route);


    
  const getUserData = async () => {
    if(user == null) {
      // setLoading({...loading, checked: false, authenticated: false})
    } else if(user != null && user_card == null) {
      const { data, error } = await getData(user.phoneNumber);
      let newValue = {...loading};
      if(data != null) {
        console.log(")data)", data)
        setUserCard(data.card);
        newValue = {...loading, checked: true};
        if(data.subscription) {
          setSubscription(data.subscription);
          newValue = {...newValue, hasSubscription: true};
        } else {
          newValue = {...newValue, hasSubscription: false};
        }
        setLoading({...newValue });
      }
      else if(error){
        console.log(")error)", error)
        setLoading({...loading, checked: false})
      }
    }
  }

  useEffect(() => {
    getUserData();
  }, [user, user_card]);

  // useEffect(() => {

  // }, [user_card])
  
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

  const navigate = useNavigate();

  const resetContext = async () => {
    // Reset user data and navigate to home
    navigate('/');
    setUserCard(null);
    setSubscription(null);
    setLoading({
      checked: null,
      authenticated: loading?.authenticated,
      hasSubscription: null
    });
    await getUserData();
    console.log("User context reset");
    // Clear localStorage

  };

  // Value to be provided to consumers
  const value = {
    user,
    user_card,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
    validatePhoneNumber: isCameroonPhoneNumber,
    setUserCard,
    setLoading,
    subscription,
    resetContext
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