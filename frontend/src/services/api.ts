import axios from 'axios';

let accessToken: string | null = null;
let refreshPromise: Promise<string> | null = null;
let logoutCallback: (() => void) | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const registerLogoutCallback = (cb: () => void) => {
  logoutCallback = cb;
};

// VITE_API_URL is baked into the frontend at build time. Set it in Vercel to
// the public URL of the deployed backend, for example
// https://real-estate-api.example.com/api.
const configuredApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '');
const apiBaseUrl = configuredApiUrl ||
  (import.meta.env.DEV ? 'http://localhost:5001/api' : '/api');

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/login' &&
      originalRequest.url !== '/auth/refresh'
    ) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = api
          .post('/auth/refresh')
          .then((res) => {
            const token = res.data.accessToken;
            setAccessToken(token);
            refreshPromise = null;
            return token;
          })
          .catch((err) => {
            refreshPromise = null;
            setAccessToken(null);
            if (logoutCallback) {
              logoutCallback();
            }
            return Promise.reject(err);
          });
      }

      try {
        const token = await refreshPromise;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
