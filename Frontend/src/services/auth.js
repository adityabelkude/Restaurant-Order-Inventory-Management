export const AUTH_STORAGE_KEY = "restaurant_auth";

export const getAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
};

export const setAuth = (payload) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
};

export const clearAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getToken = () => getAuth()?.token || null;
export const getUser = () => getAuth()?.user || null;
