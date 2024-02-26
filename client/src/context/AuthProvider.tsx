import { createContext, useState, ReactNode } from 'react';

const AuthContext = createContext({});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [auth, setAuth] = useState({});
    const persistData = localStorage.getItem('persist');
    const persistedState = persistData ? JSON.parse(persistData) : false;
    const [persist, setPersist] = useState(persistedState);

    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
