const TOKEN_KEY = "auth_token";
const ROLE_KEY = "auth_role";

export const saveAuth = (token, role) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getRole = () => {
  return localStorage.getItem(ROLE_KEY);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};
