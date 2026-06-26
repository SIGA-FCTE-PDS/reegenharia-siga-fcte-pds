import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Role = 'ALUNO' | 'PROFESSOR' | 'SECRETARIA';

export interface User {
    idOuMatricula: string;
    nome: string;
    role: Role;
}

interface AuthContextData {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('@SIGA:user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('@SIGA:user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('@SIGA:user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);