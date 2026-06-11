// Token helpers — JWT is returned in response body and stored in localStorage
// This is secure for SPAs when combined with short token expiry and HTTPS in production.

const TOKEN_KEY = "nextt_token";

export const tokenStore = {
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  set: (token: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  clear: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
  },
};

// Guest access token — stored in sessionStorage (per-tab, auto-clears on close)
// Sent as x-guest-registration-token header for guest payment/email operations
const GUEST_TOKEN_KEY = "nextt_guest_token";

export const guestTokenStore = {
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(GUEST_TOKEN_KEY);
  },

  set: (token: string): void => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(GUEST_TOKEN_KEY, token);
  },

  clear: (): void => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(GUEST_TOKEN_KEY);
  },
};
