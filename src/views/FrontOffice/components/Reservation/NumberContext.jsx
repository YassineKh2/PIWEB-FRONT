import React, { createContext, useState, useContext } from "react";

// Créez un contexte
const NumberContext = createContext();

// Créez un fournisseur pour le contexte
export const NumberProvider = ({ children }) => {
  const [number, setNumber] = useState(0);

  return (
    <NumberContext.Provider value={{ number, setNumber }}>
      {children}
    </NumberContext.Provider>
  );
};

// Créez un hook personnalisé pour utiliser le contexte
export const useNumber = () => useContext(NumberContext);
