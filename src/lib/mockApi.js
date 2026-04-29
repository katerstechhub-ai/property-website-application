// MOCK DATA - Replace with real API when available

// Mock users
const mockUsers = [
  {
    _id: "1",
    first_name: "John",
    last_name: "Doe",
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

// Mock properties
const mockProperties = [
  {
    _id: "prop1",
    name: "Luxury Apartment",
    price: "25000000",
    city: "Lagos",
    state: "Lagos",
    address: "123 Victoria Island",
    description: "Beautiful 3-bedroom apartment",
    type: "RENT",
    category: "APARTMENT",
    bedroom: 3,
    bathroom: 2,
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
    description: "Luxury duplex with pool",
    type: "SALES",
    category: "DUPLEX",
    bedroom: 5,
    bathroom: 4,
    images: [],
    is_verified: false
  }
];

// Mock token function
export async function getMockToken() {
  return "mock-token-12345";
}

// Mock login
export async function mockLogin(email, password) {
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
export async function mockRegister(userData, role) {
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

// Mock get properties
export async function mockGetProperties() {
  return { data: mockProperties };
}

// Mock get property by ID
export async function mockGetPropertyById(id) {
  const property = mockProperties.find(p => p._id === id);
  return { data: property };
}