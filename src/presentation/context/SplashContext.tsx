import React, { createContext, useCallback, useContext, useState } from 'react';

interface SplashContextValue {
  hideSplash: () => void;
}

const SplashContext = createContext<SplashContextValue>({
  hideSplash: () => undefined,
});

export const useSplash = () => useContext(SplashContext);

export const SplashProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(true);

  const hideSplash = useCallback(() => {
    const el = document.getElementById('splash');
    if (el) {
      el.style.opacity = '0';
      el.style.visibility = 'hidden';
      setTimeout(() => el.remove(), 500);
    }
    setVisible(false);
  }, []);

  return (
    <SplashContext.Provider value={{ hideSplash }}>
      {children}
    </SplashContext.Provider>
  );
};
