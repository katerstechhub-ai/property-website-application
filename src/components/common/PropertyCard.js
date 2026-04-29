import Link from "next/link";
import { formatPrice, getPropertyTypeColor, truncateText } from "@/src/utils/formatters";

export default function PropertyCard({ property }) {
  if (!property) return null;

  const typeColor = getPropertyTypeColor(property.type);

  return (
    <Link href={`/public/properties/${property._id}`}>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        {/* Image */}
        <div className="h-48 bg-gray-200 relative">
          {property.images?.[0] ? (
            <img 
              src={property.images[0]} 
              alt={property.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <span className="text-4xl">🏠</span>
            </div>
          )}
          {/* Property Type Badge */}
          <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${typeColor}`}>
            {property.type}
          </span>
          {/* Verification Badge */}
          {property.is_verified && (
            <span className="absolute top-3 left-3 px-2 py-1 bg-green-500 text-white rounded-full text-xs">
              ✓ Verified
            </span>
          )}
        </div>

        {/* Details */}
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-1 line-clamp-1">{property.name}</h2>
          <p className="text-gray-500 text-sm mb-2">
            {property.city}, {property.state}
          </p>
          <p className="text-blue-600 font-bold text-xl mb-3">{formatPrice(property.price)}</p>
          
          {/* Features */}
          <div className="flex gap-4 text-sm text-gray-600 border-t pt-3">
            <span className="flex items-center gap-1">🛏️ {property.bedroom || 0}</span>
            <span className="flex items-center gap-1">🛁 {property.bathroom || 0}</span>
            <span className="flex items-center gap-1">📐 {property.total_area || "N/A"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}