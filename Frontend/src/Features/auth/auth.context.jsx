import { useState, useEffect } from "react";
import { createContext } from "react";
import { getMe } from "./api/auth.api";

export const AuthContext = createContext()

export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            try {
                const response = await getMe();
                setUser(response.user);
            } catch (error) {
                console.error("Not authenticated");
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    return <AuthContext.Provider value={{loading, setLoading, user, setUser}}>
        {children}
    </AuthContext.Provider>
}