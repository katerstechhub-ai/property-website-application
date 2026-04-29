import Link from "next/link";
import Button from "../common/Button";
import { formatPrice } from "@/src/utils/formatters";

export default function WishlistCard({ property, onRemove }) {
  return (
    <div className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition">
      <div className="h-48 bg-gray-100 relative">
        {property.images?.[0] ? (
          <img src={property.images[0]} alt={property.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-200">🏠</div>
        )}
        <button
          onClick={() => onRemove(property._id)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition"
        >
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{property.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{property.city}, {property.state}</p>
        <p className="text-blue-600 font-bold text-xl mb-3">{formatPrice(property.price)}</p>
        <div className="flex gap-2 mb-3">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{property.type}</span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{property.category}</span>
        </div>
        <Link href={`/public/properties/${property._id}`}>
          <Button variant="primary" size="sm" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}