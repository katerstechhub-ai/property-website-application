// utils/auth.js
export function saveAuth(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("merchant", JSON.stringify(data));
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getMerchant() {
  return JSON.parse(localStorage.getItem("merchant"));
}
