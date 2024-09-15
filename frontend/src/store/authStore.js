import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5001/api";
// import.meta.env.NODE_ENV === "production"
//   ? "/api"
//   : "http://localhost:5001/api";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,
  resetTokenValidate: false,

  signup: async ({ fullName, email, password, confirmPassword }) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        fullName,
        email,
        password,
        confirmPassword,
      });
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Signing Up",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async ({ email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data.message || "Error Logging In",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/auth/verify-email`, { code });
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.log(error);
      set({
        error: error.response.data.message || "Error Verifying Email",
        isLoading: false,
      });
      throw error;
    }
  },

  getMe: async () => {
    set({ isLoading: true, error: null, isCheckingAuth: true });
    try {
      const res = await axios.get(`${API_URL}/auth/me`);
      set({
        user: res.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error;
    }
  },

  resendVerificationEmail: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/auth/resend-verification-email`, { email });
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.response.data.message });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/auth/logout`);
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ error: error.response.data.message, isLoading: false });
      throw error;
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });
      set({ isLoading: false, message: res.data.message });
    } catch (error) {
      set({ error: error.response.data.message, isLoading: false });
      throw error;
    }
  },

  checkTokenValidation: async (token) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/auth//is-token-valid/${token}`);
      set({ isLoading: false, resetTokenValidate: true });
    } catch (error) {
      set({ error: error.response.data.message, isLoading: false });
      throw error;
    }
  },

  updatePassword: async (token, password, confirmPassword) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });
      set({ isLoading: false, message: res.data.message });
    } catch (error) {
      set({ error: error.response.data.message, isLoading: false });
      throw error;
    }
  },
}));
