import React, { createContext, useContext, useState } from 'react';

const AppBarContext = createContext();

export const AppBarProvider = ({ children }) => {
  const [title, setTitle] = useState('My App');
  const [showBackButton, setShowBackButton] = useState(false);
  const [actions, setActions] = useState(null);

  return (
    <AppBarContext.Provider
      value={{
        title,
        setTitle,
        showBackButton,
        setShowBackButton,
        actions,
        setActions,
      }}
    >
      {children}
    </AppBarContext.Provider>
  );
};

export const useAppBar = () => {
  const context = useContext(AppBarContext);
  if (context === undefined) {
    throw new Error('useAppBar must be used within an AppBarProvider');
  }
  return context;
};