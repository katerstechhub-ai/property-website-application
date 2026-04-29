import { API_BASE_URL, ENDPOINTS } from "./constants";
import { getPublicToken, getUserToken, setUserToken, setCurrentUser } from "./token";

// TEMPORARY: Mock API for testing when real API is down
const USE_MOCK_API = true; // Set to false when real API is available

// Mock data
const mockUsers = [
  {
    _id: "1",
    first_name: "John",
    last_name: "Doe",
    full_name: "John Doe",
    email: "tenant@test.com",
    password: "12345678",
    phone: "08012345678",
    role: "user"
  },
  {
    _id: "2",
    full_name: "Jane Agent",
    email: "agent@test.com",
    password: "12345678",
    phone: "08012345679",
    company: "Realty Corp",
    role: "agent",
    is_verified: true
  },
  {
    _id: "3",
    full_name: "Admin User",
    email: "admin@test.com",
    password: "12345678",
    phone: "08012345670",
    role: "admin"
  }
];

const mockProperties = [
  {
    _id: "prop1",
    name: "Luxury Apartment",
    price: "25000000",
    city: "Lagos",
    state: "Lagos",
    address: "123 Victoria Island",
    description: "Beautiful 3-bedroom apartment with ocean view",
    type: "RENT",
    category: "APARTMENT",
    bedroom: 3,
    bathroom: 2,
    toilet: 2,
    parking_space: 2,
    images: [],
    is_verified: true
  },
  {
    _id: "prop2",
    name: "Modern Duplex",
    price: "75000000",
    city: "Abuja",
    state: "FCT",
    address: "Maitama",
    description: "Luxury duplex with swimming pool",
    type: "SALES",
    category: "DUPLEX",
    bedroom: 5,
    bathroom: 4,
    toilet: 4,
    parking_space: 3,
    images: [],
    is_verified: false
  },
  {
    _id: "prop3",
    name: "Cozy Studio",
    price: "500000",
    city: "Lagos",
    state: "Lagos",
    address: "Ikeja",
    description: "Perfect for singles or couples",
    type: "RENT",
    category: "FLAT",
    bedroom: 1,
    bathroom: 1,
    toilet: 1,
    parking_space: 1,
    images: [],
    is_verified: true
  }
];

// Mock token
async function getMockToken() {
  return "mock-token-12345";
}

// Mock login
async function mockLogin(email, password) {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return {
      success: true,
      token: "mock-token-" + Date.now(),
      user: userWithoutPassword
    };
  }
  
  return {
    success: false,
    error: "Invalid email or password. Try tenant@test.com / 12345678"
  };
}

// Mock register
async function mockRegister(userData, role) {
  const newUser = {
    _id: Date.now().toString(),
    ...userData,
    role: role === "agent" ? "agent" : "user",
    is_verified: role === "agent" ? false : true
  };
  
  mockUsers.push(newUser);
  
  return {
    success: true,
    user: newUser,
    message: "Registration successful! Please login."
  };
}

// Helper function for API requests
async function apiRequest(endpoint, options = {}, isPublic = false) {
  if (USE_MOCK_API) {
    // Return mock data for common requests
    if (endpoint.includes("/properties") && !endpoint.includes("/properties/")) {
      return { data: mockProperties };
    }
    if (endpoint.includes("/properties/")) {
      const id = endpoint.split("/").pop();
      const property = mockProperties.find(p => p._id === id);
      return { data: property };
    }
    return { data: [] };
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  let token;
  if (isPublic) {
    token = await getPublicToken();
  } else {
    token = getUserToken();
  }
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || "Request failed");
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// ============ AUTHENTICATION ============

// Login user
export async function login(email, password) {
  if (USE_MOCK_API) {
    return await mockLogin(email, password);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.LOGIN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (response.ok && data.token) {
      setUserToken(data.token);
      setCurrentUser(data.user || { email });
      return { success: true, user: data.user, token: data.token };
    }
    
    if (response.status === 401) {
      return { success: false, error: "Invalid email or password" };
    }
    if (response.status === 404) {
      return { success: false, error: "Login service unavailable. Please try again later." };
    }
    
    return { success: false, error: data.message || data.error || "Login failed" };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Cannot connect to server. Please check your connection." };
  }
}

// Register Tenant
export async function registerTenant(userData) {
  if (USE_MOCK_API) {
    return await mockRegister(userData, "tenant");
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.USERS}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, user: data };
    }
    return { success: false, error: data.message || "Registration failed" };
  } catch (error) {
    return { success: false, error: "Connection error. Please try again." };
  }
}

// Register Agent
export async function registerAgent(agentData, token) {
  if (USE_MOCK_API) {
    return await mockRegister(agentData, "agent");
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AGENTS}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(agentData),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, agent: data };
    }
    return { success: false, error: data.message || "Failed to create agent" };
  } catch (error) {
    return { success: false, error: "Connection error" };
  }
}

// Logout
export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

// ============ PROPERTIES ============

// Get all properties
export async function getProperties(filters = {}) {
  if (USE_MOCK_API) {
    let filtered = [...mockProperties];
    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }
    if (filters.city) {
      filtered = filtered.filter(p => p.city.toLowerCase().includes(filters.city.toLowerCase()));
    }
    return filtered;
  }
  
  const params = new URLSearchParams(filters);
  const endpoint = `${ENDPOINTS.PROPERTIES}${params.toString() ? `?${params}` : ""}`;
  const data = await apiRequest(endpoint, {}, true);
  return data.data || [];
}

// Get single property by ID
export async function getPropertyById(id) {
  if (USE_MOCK_API) {
    const property = mockProperties.find(p => p._id === id);
    return property;
  }
  
  const data = await apiRequest(ENDPOINTS.PROPERTY_BY_ID(id), {}, true);
  return data.data || data;
}

// Create property
export async function createProperty(propertyData) {
  if (USE_MOCK_API) {
    const newProperty = {
      _id: "prop" + Date.now(),
      ...propertyData,
      is_verified: false,
      images: []
    };
    mockProperties.push(newProperty);
    return newProperty;
  }
  
  const data = await apiRequest(ENDPOINTS.PROPERTIES, {
    method: "POST",
    body: JSON.stringify(propertyData),
  });
  return data.data || data;
}

// Update property
export async function updateProperty(id, propertyData) {
  if (USE_MOCK_API) {
    const index = mockProperties.findIndex(p => p._id === id);
    if (index !== -1) {
      mockProperties[index] = { ...mockProperties[index], ...propertyData };
      return mockProperties[index];
    }
    throw new Error("Property not found");
  }
  
  const data = await apiRequest(ENDPOINTS.PROPERTY_BY_ID(id), {
    method: "PUT",
    body: JSON.stringify(propertyData),
  });
  return data.data || data;
}

// Delete property
export async function deleteProperty(id) {
  if (USE_MOCK_API) {
    const index = mockProperties.findIndex(p => p._id === id);
    if (index !== -1) {
      mockProperties.splice(index, 1);
    }
    return { success: true };
  }
  
  await apiRequest(ENDPOINTS.PROPERTY_BY_ID(id), {
    method: "DELETE",
  });
  return { success: true };
}

// Get properties by agent
export async function getPropertiesByAgent(agentId) {
  if (USE_MOCK_API) {
    return mockProperties;
  }
  
  const data = await apiRequest(ENDPOINTS.PROPERTIES_BY_AGENT(agentId));
  return data.data || [];
}

// ============ APPOINTMENTS ============

// Create appointment
export async function createAppointment(appointmentData) {
  if (USE_MOCK_API) {
    return {
      _id: "apt" + Date.now(),
      ...appointmentData,
      status: "pending",
      createdAt: new Date().toISOString()
    };
  }
  
  const data = await apiRequest(ENDPOINTS.APPOINTMENTS, {
    method: "POST",
    body: JSON.stringify(appointmentData),
  });
  return data.data || data;
}

// Get appointments
export async function getAppointments(filters = {}) {
  if (USE_MOCK_API) {
    return [];
  }
  
  const params = new URLSearchParams(filters);
  const endpoint = `${ENDPOINTS.APPOINTMENTS}${params.toString() ? `?${params}` : ""}`;
  const data = await apiRequest(endpoint);
  return data.data || [];
}

// ============ WISHLIST ============

// Get user wishlist
export async function getUserWishlist(userId) {
  if (USE_MOCK_API) {
    return [];
  }
  
  const data = await apiRequest(ENDPOINTS.USER_WISHLIST(userId));
  return data.data || [];
}

// Add to wishlist
export async function addToWishlist(userId, propertyId) {
  if (USE_MOCK_API) {
    return { success: true };
  }
  
  const data = await apiRequest(ENDPOINTS.USER_WISHLIST(userId), {
    method: "POST",
    body: JSON.stringify({ property_id: propertyId, user_id: userId }),
  });
  return data;
}

// Remove from wishlist
export async function removeFromWishlist(userId, propertyId) {
  if (USE_MOCK_API) {
    return { success: true };
  }
  
  await apiRequest(`${ENDPOINTS.USER_WISHLIST(userId)}/${propertyId}`, {
    method: "DELETE",
  });
  return { success: true };
}

// ============ USERS (Admin) ============

// Get all users
export async function getAllUsers() {
  if (USE_MOCK_API) {
    return mockUsers.filter(u => u.role === "user");
  }
  
  const data = await apiRequest(ENDPOINTS.USERS);
  return data.data || [];
}

// Delete user
export async function deleteUser(userId) {
  if (USE_MOCK_API) {
    const index = mockUsers.findIndex(u => u._id === userId);
    if (index !== -1) {
      mockUsers.splice(index, 1);
    }
    return { success: true };
  }
  
  await apiRequest(`${ENDPOINTS.USERS}/${userId}`, {
    method: "DELETE",
  });
  return { success: true };
}

// ============ AGENTS (Admin) ============

// Get all agents
export async function getAllAgents() {
  if (USE_MOCK_API) {
    return mockUsers.filter(u => u.role === "agent");
  }
  
  const data = await apiRequest(ENDPOINTS.AGENTS);
  return data.data || [];
}

// Delete agent
export async function deleteAgent(agentId) {
  if (USE_MOCK_API) {
    const index = mockUsers.findIndex(u => u._id === agentId);
    if (index !== -1) {
      mockUsers.splice(index, 1);
    }
    return { success: true };
  }
  
  await apiRequest(`${ENDPOINTS.AGENTS}/${agentId}`, {
    method: "DELETE",
  });
  return { success: true };
}