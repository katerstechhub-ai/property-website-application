// API Base URL
export const API_BASE_URL = "http://property.reworkstaging.name.ng/v1";

// Public email for token generation
export const PUBLIC_EMAIL = "d@g.com";

// Property Types
export const PROPERTY_TYPES = ["RENT", "LEASE", "SALES"];

// Property Categories
export const PROPERTY_CATEGORIES = ["FLAT", "APARTMENT", "LAND", "DUPLEX", "WAREHOUSE", "SHOP"];

// Payment Plans
export const PAYMENT_PLANS = ["PER_ANNUM", "MONTHLY", "PER_PLOT", "PER_DAY"];

// Property Uses
export const PROPERTY_USES = ["RESIDENTIAL", "COMMERCIAL"];

// Furnishing Options
export const FURNISHING_OPTIONS = ["FURNISHED", "UNFURNISHED"];

// API Endpoints
export const ENDPOINTS = {
// Auth
LOGIN: "/auth/login",
GET_TOKEN: "/token",

// Users
USERS: "/users",
USER_WISHLIST: (userId) => `/users/${userId}/wishlist`,
USER_PROPERTIES: (userId) => `/users/${userId}/properties`,

// Agents
AGENTS: "/agents",
AGENT_WISHLIST: (agentId) => `/agents/${agentId}/wishlist`,

// Properties
PROPERTIES: "/properties",
PROPERTY_BY_ID: (id) => `/properties/${id}`,
PROPERTIES_BY_AGENT: (agentId) => `/properties?agent=${agentId}`,
VERIFY_PROPERTY: (id) => `/properties/${id}/set-verified`,

// Appointments
APPOINTMENTS: "/appointments",
CONFIRM_APPOINTMENT: (id) => `/appointments/${id}/confirm-meeting`,
COMPLETE_APPOINTMENT_AGENT: (id) => `/appointments/${id}/set-agent-appointment-completion`,
COMPLETE_APPOINTMENT_USER: (id) => `/appointments/${id}/set-user-appointment-completion`,

// Reviews
REVIEWS: "/reviews",
REVIEWS_BY_PROPERTY: (propertyId) => `/reviews?property_id=${propertyId}`,

// Merchants
MERCHANTS: "/merchants",
MERCHANT_AGENTS: (merchantId) => `/merchants/${merchantId}/agents`,
VERIFY_AGENT: "/merchants/verify-agent",
};