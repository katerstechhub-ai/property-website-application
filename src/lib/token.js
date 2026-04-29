import { API_BASE_URL, PUBLIC_EMAIL, ENDPOINTS } from "./constants";

let cachedPublicToken = null;
let tokenExpiry = null;

// Get public token for viewing properties (no login required)
export async function getPublicToken() {
    // Return cached token if still valid
    if (cachedPublicToken && tokenExpiry && Date.now() < tokenExpiry) {
        return cachedPublicToken;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${ENDPOINTS.GET_TOKEN}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: PUBLIC_EMAIL }),
        });

        const data = await response.json();

        if (data.token) {
            cachedPublicToken = data.token;
            // Tokens usually expire in 1 hour, set expiry for 50 minutes
            tokenExpiry = Date.now() + 50 * 60 * 1000;
            return cachedPublicToken;
        }
        throw new Error("Failed to get public token");
    } catch (error) {
        console.error("Error getting public token:", error);
        throw error;
    }
}

// Get user token from localStorage
export function getUserToken() {
    if (typeof window !== "undefined") {
        return localStorage.getItem("token");
    }
    return null;
}

// Store user token after login
export function setUserToken(token) {
    if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
    }
}

// Remove token on logout
export function removeUserToken() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }
}

// Get current user from localStorage
export function getCurrentUser() {
    if (typeof window !== "undefined") {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }
    return null;
}

// Store current user
export function setCurrentUser(user) {
    if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
    }
}