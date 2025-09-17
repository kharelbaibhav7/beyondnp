import axios from "axios";
import { serverURL } from "../constant";
import { tokenManager } from "./tokenManager";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: serverURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      tokenManager.clearToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: async (userData) => {
    const response = await api.post("/users/register", userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post("/users/login", credentials);
    return response.data;
  },
  verifyEmail: async (verificationData) => {
    const response = await api.post("/users/verify-email", verificationData);
    return response.data;
  },
  resendVerification: async (email) => {
    const response = await api.post("/users/resend-verification", { email });
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await api.post("/users/forgot-password", { email });
    return response.data;
  },
  resetPassword: async (resetData) => {
    const response = await api.post("/users/reset-password", resetData);
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },
  updateProfile: async (userData) => {
    const response = await api.put("/users/profile", userData);
    return response.data;
  },
  logout: () => {
    tokenManager.clearToken();
  },
};

// Notes API
export const notesAPI = {
  getAll: async () => {
    const response = await api.get("/notes");
    return response.data;
  },
  getByCollection: async (collectionId) => {
    const response = await api.get(`/notes?collectionId=${collectionId}`);
    return response.data;
  },
  getArchived: async () => {
    const response = await api.get("/notes/archived");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },
  create: async (noteData) => {
    const response = await api.post("/notes", noteData);
    return response.data;
  },
  update: async (id, noteData) => {
    const response = await api.put(`/notes/${id}`, noteData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/notes/${id}`);
    return response.data;
  },
  archive: async (id) => {
    const response = await api.put(`/notes/${id}`, { isArchived: true });
    return response.data;
  },
  pin: async (id, isPinned) => {
    const response = await api.put(`/notes/${id}`, { isPinned });
    return response.data;
  },
  search: async (query) => {
    const response = await api.get(
      `/notes/search?query=${encodeURIComponent(query)}`
    );
    return response.data;
  },
};

// Collections API
export const collectionsAPI = {
  getAll: async () => {
    const response = await api.get("/collections");
    return response.data;
  },
  getArchived: async () => {
    const response = await api.get("/collections/archived");
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/collections/${id}`);
    return response.data;
  },
  create: async (collectionData) => {
    const response = await api.post("/collections", collectionData);
    return response.data;
  },
  update: async (id, collectionData) => {
    const response = await api.put(`/collections/${id}`, collectionData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/collections/${id}`);
    return response.data;
  },
  archive: async (id) => {
    const response = await api.put(`/collections/${id}`, { isArchived: true });
    return response.data;
  },
};

export default api;
