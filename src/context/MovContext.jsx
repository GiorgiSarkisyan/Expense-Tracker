/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const MovContext = createContext();

export function MovProvider({ children }) {
  const [modal, setModal] = useState(false);

  return (
    <MovContext.Provider value={{ modal, setModal }}>
      {children}
    </MovContext.Provider>
  );
}
