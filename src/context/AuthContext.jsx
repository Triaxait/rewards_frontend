import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../services/api/customer";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if(!accessToken) throw new Error("No token");
        
        const res = await apiFetch("/auth/me", {
          credentials: "include",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });

        if(!res.user) throw new Error("No user");
        setUser(res.user); 
        localStorage.setItem("user", JSON.stringify(res.user));
      } catch (err) {
        console.error(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = (userData,accessToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", accessToken);
    setUser(userData);
  };

  const logout = async () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
          await apiFetch("/auth/logout", {
            method: "POST",
            credentials: "include",
          });
          setUser(null);
        };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children} 
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
