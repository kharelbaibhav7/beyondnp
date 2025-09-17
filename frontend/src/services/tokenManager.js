// Token manager to handle token storage and retrieval
// This ensures consistency between AuthContext and API service

let token = null;
let onTokenChange = null;

export const tokenManager = {
  setToken: (newToken) => {
    token = newToken;
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    if (onTokenChange) {
      onTokenChange(newToken);
    }
  },

  getToken: () => {
    return token || localStorage.getItem("token");
  },

  clearToken: () => {
    token = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (onTokenChange) {
      onTokenChange(null);
    }
  },

  setOnTokenChange: (callback) => {
    onTokenChange = callback;
  },

  // Initialize token from localStorage on app start
  initialize: () => {
    token = localStorage.getItem("token");
  },
};
