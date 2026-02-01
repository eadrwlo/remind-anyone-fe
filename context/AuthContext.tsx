import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import * as Storage from '../utils/storage';

interface User {
    id: number;
    email: string;
    username: string;
    full_name?: string;
    picture?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    signIn: (idToken: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const token = await Storage.getItem('token');
            if (token) {
                // Token exists, fetch user details
                const response = await api.get('/auth/me');
                setUser(response.data);
            }
        } catch (e) {
            console.log('Failed to load user', e);
            // If valid token check fails, clear it
            await Storage.deleteItem('token');
        } finally {
            setIsLoading(false);
        }
    };

    const signIn = async (idToken: string) => {
        try {
            setIsLoading(true);
            console.log('Signing in with token', idToken);
            const response = await api.post('/auth/login', { id_token: idToken });
            const { access_token } = response.data;

            await Storage.setItem('token', access_token);

            // Fetch user details immediately
            const meResponse = await api.get('/auth/me');
            setUser(meResponse.data);

        } catch (e) {
            console.error('Sign in failed', e);
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        try {
            await Storage.deleteItem('token');
            setUser(null);
        } catch (e) {
            console.error('Sign out failed', e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};
