// Validate email
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validate phone number (Nigerian format)
export const isValidPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 11;
};

// Validate password (min 6 characters)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Validate password match
export const doPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

// Validate property price
export const isValidPrice = (price) => {
  const numPrice = typeof price === "string" ? parseFloat(price.replace(/,/g, "")) : price;
  return !isNaN(numPrice) && numPrice > 0;
};

// Validate required fields
export const isRequired = (value) => {
  return value !== null && value !== undefined && value.toString().trim() !== "";
};

// Get validation error message
export const getValidationError = (field, value) => {
  switch (field) {
    case "email":
      return isValidEmail(value) ? null : "Please enter a valid email address";
    case "phone":
      return isValidPhone(value) ? null : "Please enter a valid phone number";
    case "password":
      return isValidPassword(value) ? null : "Password must be at least 6 characters";
    default:
      return isRequired(value) ? null : `${field} is required`;
  }
};