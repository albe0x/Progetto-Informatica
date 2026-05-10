/**
 * @param {string} name - Nome del cookie
 */
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

/**
 * @param {string} name - Nome del cookie
 * @param {string} value - Valore (es. il token)
 * @param {number} days - Durata in giorni (opzionale)
 */
export const setCookie = (name, value, days = 7) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  // Secure; SameSite=Lax è lo standard moderno per la sicurezza
  document.cookie = `${name}=${value || ""}${expires}; path=/; SameSite=Lax`;
};

/**
 * @param {string} name - Nome del cookie
 */
export const removeCookie = (name) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
};
