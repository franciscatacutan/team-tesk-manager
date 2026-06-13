let accessToken: string | null = null;
const unauthorizedListeners = new Set<() => void>();

export const authStorage = {
  getToken: () => accessToken,
  hasToken: () => accessToken !== null,
  setToken: (token: string) => {
    accessToken = token;
  },
  clearToken: () => {
    accessToken = null;
  },
  subscribeUnauthorized: (listener: () => void) => {
    unauthorizedListeners.add(listener);
    return () => unauthorizedListeners.delete(listener);
  },
  notifyUnauthorized: () => {
    unauthorizedListeners.forEach((listener) => listener());
  },
};
