import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, logout, register, getMe } from "../api/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);

  const { loading, setLoading, user, setUser } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const response = await login({ email, password });
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      setUser(response.user);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        error: err?.response?.data?.message || "Login failed",
      };
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const response = await register({ username, email, password });
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      setUser(response.user);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      return {
        success: false,
        error: err?.response?.data?.message || "Register failed",
      };
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setLoading(false);
    }
    return { success: true };
  };

  const handleGetMe = async () => {
    try {
      setLoading(true);
      const response = await getMe();
      setUser(response.user);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  return {
    loading,
    user,
    handleLogin,
    handleRegister,
    handleGetMe,
    handleLogout,
  };
};
