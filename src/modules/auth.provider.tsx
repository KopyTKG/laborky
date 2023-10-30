'use client'
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext<any>(null);
export const useAuth = () => useContext(AuthContext);



export function AuthWrapper({
    children,
  }: {
    children: React.ReactNode
  }) {
      const [stag, setStag] = useState<any>('');
  return (
        <AuthContext.Provider value={{stag, setStag}}>
            {children}
        </AuthContext.Provider>
    )
}
