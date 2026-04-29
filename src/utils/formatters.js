// Format price with commas and currency symbol
export const formatPrice = (price) => {
  if (!price) return "₦0";
  const numPrice = typeof price === "string" ? parseFloat(price.replace(/,/g, "")) : price;
  return `₦${numPrice.toLocaleString()}`;
};

// Format date to readable format
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format time
export const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  return timeString;
};

// Format phone number
export const formatPhone = (phone) => {
  if (!phone) return "N/A";
  // Format as 080-123-4567
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Get property type badge color
export const getPropertyTypeColor = (type) => {
  switch (type?.toUpperCase()) {
    case "RENT":
      return "bg-green-100 text-green-700";
    case "SALES":
      return "bg-blue-100 text-blue-700";
    case "LEASE":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Get appointment status badge
export const getAppointmentStatusBadge = (status) => {
  const config = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
    accepted: { bg: "bg-green-100", text: "text-green-800", label: "Accepted" },
    rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
    completed: { bg: "bg-blue-100", text: "text-blue-800", label: "Completed" },
  };
  const s = config[status?.toLowerCase()] || config.pending;
  return { bg: s.bg, text: s.text, label: s.label };
};

// Get property verification badge
export const getVerificationBadge = (isVerified) => {
  return isVerified
    ? { bg: "bg-green-100", text: "text-green-700", label: "✓ Verified" }
    : { bg: "bg-yellow-100", text: "text-yellow-700", label: "⏳ Pending" };
};