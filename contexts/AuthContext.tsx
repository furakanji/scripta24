"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (e: string, p: string) => Promise<void>;
    signUpWithEmail: (e: string, p: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: "select_account" });
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    const signInWithEmail = async (e: string, p: string) => {
        try {
            await signInWithEmailAndPassword(auth, e, p);
        } catch (error) {
            console.error("Error signing in with Email", error);
            throw error;
        }
    };

    const signUpWithEmail = async (e: string, p: string) => {
        try {
            await createUserWithEmailAndPassword(auth, e, p);
        } catch (error) {
            console.error("Error signing up with Email", error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
