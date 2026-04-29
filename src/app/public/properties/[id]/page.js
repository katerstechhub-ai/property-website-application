"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  HeartIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  HomeIcon,
  BuildingOfficeIcon,
  SparklesIcon,
  ShieldCheckIcon,
  StarIcon,
  ChevronRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShareIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

export default function PropertyDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [user, setUser] = useState(null);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [bookingData, setBookingData] = useState({
        date: "",
        time: { from: "10:00", to: "12:00" },
        msg: ""
    });
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [bookingError, setBookingError] = useState("");
    const [bookingSuccess, setBookingSuccess] = useState("");

    // Complete mock property data for ALL 8 properties
    const mockProperties = {
        "1": {
            _id: "1",
            name: "Luxury Beachfront Villa",
            price: "350,000,000",
            city: "Lagos",
            state: "Lagos",
            address: "Lekki Phase 1, Lagos, Nigeria",
            description: "Experience unparalleled luxury in this stunning beachfront villa. With panoramic ocean views, private pool, and direct beach access, this property offers the ultimate coastal lifestyle. The villa features floor-to-ceiling windows, modern finishes, and spacious living areas perfect for entertaining.",
            category: "VILLA",
            type: "SALES",
            payment_plan: "ONE_TIME",
            furnishing: "FULLY_FURNISHED",
            bedroom: 5,
            bathroom: 6,
            toilet: 6,
            parking_space: 4,
            total_area: "450 sqm",
            images: ["https://i.pinimg.com/736x/a2/7a/e1/a27ae171ead1f2b1a488dfeaea496c5b.jpg"],
            is_verified: true,
            featured: true,
            amenities: ["SWIMMING_POOL", "GYM", "PARKING", "SECURITY", "OCEAN_VIEW", "PRIVATE_BEACH"],
            disclaimer: "Price is negotiable upon serious inquiry",
            agent: "Premium Realty Ltd",
            agentPhone: "+234 801 234 5678",
            agentEmail: "premium@realty.com",
            yearBuilt: "2022",
            propertyId: "PRP-001"
        },
        "2": {
            _id: "2",
            name: "Modern Executive Apartment",
            price: "2,500,000",
            city: "Abuja",
            state: "FCT",
            address: "Maitama, Abuja, Nigeria",
            description: "Beautiful 3-bedroom apartment in the heart of Abuja. Features modern finishes, spacious rooms, and excellent security. Close to shopping malls, restaurants, and business districts.",
            category: "APARTMENT",
            type: "RENT",
            payment_plan: "PER_ANNUM",
            furnishing: "FURNISHED",
            bedroom: 3,
            bathroom: 3,
            toilet: 3,
            parking_space: 2,
            total_area: "180 sqm",
            images: ["https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600"],
            is_verified: true,
            featured: false,
            amenities: ["PARKING", "SECURITY", "GENERATOR", "WATER_SUPPLY", "ELEVATOR"],
            disclaimer: "Annual rent payment required",
            agent: "Capital Realty",
            agentPhone: "+234 802 345 6789",
            agentEmail: "capital@realty.com",
            yearBuilt: "2021",
            propertyId: "PRP-002"
        },
        "3": {
            _id: "3",
            name: "Cozy Family Home",
            price: "85,000,000",
            city: "Port Harcourt",
            state: "Rivers",
            address: "GRA Phase 2, Port Harcourt",
            description: "Spacious 4-bedroom family home with a beautiful garden, perfect for raising a family. Includes modern kitchen, large living area, and excellent security.",
            category: "DUPLEX",
            type: "SALES",
            payment_plan: "ONE_TIME",
            furnishing: "SEMI_FURNISHED",
            bedroom: 4,
            bathroom: 4,
            toilet: 4,
            parking_space: 3,
            total_area: "320 sqm",
            images: ["https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600"],
            is_verified: true,
            featured: false,
            amenities: ["GARDEN", "PARKING", "SECURITY", "WATER_SUPPLY", "SOLAR_PANELS"],
            disclaimer: "Price includes all legal fees",
            agent: "Port Harcourt Realty",
            agentPhone: "+234 803 456 7890",
            agentEmail: "ph@realty.com",
            yearBuilt: "2020",
            propertyId: "PRP-003"
        },
        "4": {
            _id: "4",
            name: "Studio Apartment",
            price: "800,000",
            city: "Lagos",
            state: "Lagos",
            address: "Ikeja, Lagos",
            description: "Perfect for singles or couples, this cozy studio apartment offers comfort and convenience in a prime location.",
            category: "FLAT",
            type: "RENT",
            payment_plan: "MONTHLY",
            furnishing: "FURNISHED",
            bedroom: 1,
            bathroom: 1,
            toilet: 1,
            parking_space: 1,
            total_area: "65 sqm",
            images: ["https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=600"],
            is_verified: false,
            featured: false,
            amenities: ["SECURITY", "WATER_SUPPLY", "INTERNET"],
            disclaimer: "Security deposit required",
            agent: "Lagos Properties",
            agentPhone: "+234 804 567 8901",
            agentEmail: "lagos@properties.com",
            yearBuilt: "2019",
            propertyId: "PRP-004"
        },
        "5": {
            _id: "5",
            name: "Commercial Plaza",
            price: "500,000,000",
            city: "Abuja",
            state: "FCT",
            address: "Central Business District, Abuja",
            description: "Prime commercial space perfect for businesses, offices, or retail. High foot traffic area with excellent visibility.",
            category: "COMMERCIAL",
            type: "LEASE",
            payment_plan: "PER_ANNUM",
            furnishing: "UNFURNISHED",
            bedroom: 0,
            bathroom: 8,
            toilet: 8,
            parking_space: 20,
            total_area: "1200 sqm",
            images: ["https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600"],
            is_verified: true,
            featured: true,
            amenities: ["CENTRAL_AC", "ELEVATOR", "SECURITY", "PARKING", "BACKUP_POWER"],
            disclaimer: "Lease terms negotiable",
            agent: "Abuja Commercial",
            agentPhone: "+234 805 678 9012",
            agentEmail: "commercial@abuja.com",
            yearBuilt: "2023",
            propertyId: "PRP-005"
        },
        "6": {
            _id: "6",
            name: "Penthouse Suite",
            price: "5,000,000",
            city: "Lagos",
            state: "Lagos",
            address: "Victoria Island, Lagos",
            description: "Luxury penthouse with breathtaking city views. Features high-end finishes, smart home technology, and premium amenities.",
            category: "APARTMENT",
            type: "RENT",
            payment_plan: "PER_ANNUM",
            furnishing: "LUXURY_FURNISHED",
            bedroom: 4,
            bathroom: 4,
            toilet: 4,
            parking_space: 3,
            total_area: "280 sqm",
            images: ["https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg?auto=compress&cs=tinysrgb&w=600"],
            is_verified: true,
            featured: false,
            amenities: ["SWIMMING_POOL", "GYM", "CONCIERGE", "PARKING", "SECURITY", "SMART_HOME"],
            disclaimer: "Utilities not included",
            agent: "Luxury Estates",
            agentPhone: "+234 806 789 0123",
            agentEmail: "luxury@estates.com",
            yearBuilt: "2023",
            propertyId: "PRP-006"
        },
        "7": {
            _id: "7",
            name: "Garden Paradise",
            price: "120,000,000",
            city: "Ibadan",
            state: "Oyo",
            address: "Bodija, Ibadan",
            description: "Beautiful home with large garden, perfect for nature lovers. Includes fruit trees, vegetable garden, and outdoor entertainment area.",
            category: "DUPLEX",
            type: "SALES",
            payment_plan: "ONE_TIME",
            furnishing: "SEMI_FURNISHED",
            bedroom: 4,
            bathroom: 4,
            toilet: 4,
            parking_space: 4,
            total_area: "350 sqm",
            images: ["https://images.pexels.com/photos/2587054/pexels-photo-2587054.jpeg?auto=compress&cs=tinysrgb&w=600"],
            is_verified: true,
            featured: false,
            amenities: ["GARDEN", "PARKING", "SECURITY", "SOLAR_PANELS", "WATER_TREATMENT"],
            disclaimer: "Land title available",
            agent: "Ibadan Homes",
            agentPhone: "+234 807 890 1234",
            agentEmail: "ibadan@homes.com",
            yearBuilt: "2021",
            propertyId: "PRP-007"
        },
        "8": {
            _id: "8",
            name: "Luxury Condo",
            price: "3,500,000",
            city: "Lagos",
            state: "Lagos",
            address: "Ikoyi, Lagos",
            description: "High-end condo with amazing amenities in one of Lagos' most prestigious neighborhoods.",
            category: "APARTMENT",
            type: "RENT",
            payment_plan: "PER_ANNUM",
            furnishing: "FULLY_FURNISHED",
            bedroom: 2,
            bathroom: 2,
            toilet: 2,
            parking_space: 2,
            total_area: "120 sqm",
            images: ["https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600"],
            is_verified: true,
            featured: true,
            amenities: ["SWIMMING_POOL", "GYM", "CONCIERGE", "PARKING", "SECURITY", "BACKUP_POWER"],
            disclaimer: "Minimum 2-year lease",
            agent: "Ikoyi Properties",
            agentPhone: "+234 808 901 2345",
            agentEmail: "ikoyi@properties.com",
            yearBuilt: "2022",
            propertyId: "PRP-008"
        }
    };

    const mockReviews = {
        "1": [
            { id: "r1", userName: "Michael O.", text: "Absolutely stunning property! The views are breathtaking.", createdAt: "2024-04-15", rating: 5 },
            { id: "r2", userName: "Sarah A.", text: "Went for a viewing, the agent was very professional.", createdAt: "2024-04-10", rating: 4 }
        ],
        "2": [
            { id: "r3", userName: "David K.", text: "Great location and value for money.", createdAt: "2024-04-12", rating: 4 }
        ],
        "3": [
            { id: "r4", userName: "Mary J.", text: "Perfect family home! Love the garden space.", createdAt: "2024-04-08", rating: 5 }
        ],
        "4": [
            { id: "r5", userName: "Peter O.", text: "Great for a single person. Very convenient location.", createdAt: "2024-04-05", rating: 4 }
        ],
        "5": [
            { id: "r6", userName: "Bola A.", text: "Excellent commercial space. Very professional agents.", createdAt: "2024-04-01", rating: 5 }
        ],
        "6": [
            { id: "r7", userName: "Chioma N.", text: "Breathtaking views! The penthouse is incredible.", createdAt: "2024-03-28", rating: 5 }
        ],
        "7": [
            { id: "r8", userName: "Tunde B.", text: "Beautiful property with amazing garden.", createdAt: "2024-03-25", rating: 4 }
        ],
        "8": [
            { id: "r9", userName: "Funke A.", text: "Perfect location and great amenities.", createdAt: "2024-03-20", rating: 5 }
        ]
    };

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
        
        setTimeout(() => {
            const propertyData = mockProperties[id];
            if (propertyData) {
                setProperty(propertyData);
                setReviews(mockReviews[id] || []);
            }
            setLoading(false);
        }, 500);
    }, [id]);

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!user) {
            router.push("/tenant/login");
            return;
        }
        setSubmitting(true);
        setBookingError("");
        
        setTimeout(() => {
            setBookingSuccess("Appointment booked successfully! Check your appointments page.");
            setShowBookingForm(false);
            setBookingData({ date: "", time: { from: "10:00", to: "12:00" }, msg: "" });
            setTimeout(() => setBookingSuccess(""), 5000);
            setSubmitting(false);
        }, 1000);
    };

    const handleReview = async (e) => {
        e.preventDefault();
        if (!user) {
            router.push("/tenant/login");
            return;
        }
        setSubmitting(true);
        
        setTimeout(() => {
            const newReviewObj = {
                id: Date.now().toString(),
                userName: user.first_name ? `${user.first_name} ${user.last_name}` : "You",
                text: newReview,
                createdAt: new Date().toISOString(),
                rating: 5
            };
            setReviews([newReviewObj, ...reviews]);
            setNewReview("");
            setSubmitting(false);
        }, 500);
    };

    const addToWishlist = () => {
        if (!user) {
            router.push("/tenant/login");
            return;
        }
        setIsInWishlist(true);
    };

    const shareProperty = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <BuildingOfficeIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Property not found</h2>
                <p className="text-gray-500 mb-6">The property you're looking for doesn't exist or has been removed.</p>
                <Link href="/public" className="inline-flex items-center text-blue-600 hover:text-blue-800 gap-2">
                    ← Back to properties
                </Link>
            </div>
        );
    }

    const images = property.images || [];
    const amenities = property.amenities || [];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Link href="/public" className="hover:text-blue-600">Home</Link>
                    <ChevronRightIcon className="w-3 h-3" />
                    <Link href="/public/properties" className="hover:text-blue-600">Properties</Link>
                    <ChevronRightIcon className="w-3 h-3" />
                    <span className="text-gray-900 font-medium">{property.name}</span>
                </div>
                <button 
                    onClick={shareProperty}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition"
                >
                    <ShareIcon className="w-4 h-4" />
                    Share
                </button>
            </div>

            {/* Success Message */}
            {bookingSuccess && (
                <div className="mb-6 bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    {bookingSuccess}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Images & Details */}
                <div className="lg:col-span-2">
                    {/* Main Image Gallery */}
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden mb-4">
                        {images.length > 0 ? (
                            <img src={images[activeImage]} alt={property.name} className="w-full h-96 object-cover" />
                        ) : (
                            <div className="w-full h-96 flex items-center justify-center">
                                <BuildingOfficeIcon className="w-24 h-24 text-gray-400" />
                            </div>
                        )}
                    </div>

                    {/* Property ID Badge */}
                    <div className="mb-4">
                        <span className="text-xs text-gray-400">Property ID: {property.propertyId}</span>
                    </div>

                    {/* Title & Price */}
                    <div className="border-b pb-4 mb-6">
                        <div className="flex justify-between items-start flex-wrap gap-4 mb-3">
                            <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
                            <div className="flex gap-2">
                                <button 
                                    onClick={addToWishlist} 
                                    className={`px-4 py-2 rounded-xl border transition flex items-center gap-2 ${
                                        isInWishlist ? "bg-red-50 border-red-300 text-red-600" : "hover:bg-gray-50"
                                    }`}
                                >
                                    {isInWishlist ? (
                                        <HeartSolid className="w-5 h-5 text-red-500" />
                                    ) : (
                                        <HeartIcon className="w-5 h-5" />
                                    )}
                                    {isInWishlist ? "In Wishlist" : "Save"}
                                </button>
                            </div>
                        </div>
                        <p className="text-gray-500 flex items-center gap-2">
                            <MapPinIcon className="w-4 h-4" /> {property.address}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                            <p className="text-3xl text-blue-600 font-bold">₦{parseInt(property.price).toLocaleString()}</p>
                            {property.type === "RENT" && <p className="text-sm text-gray-500">per year</p>}
                        </div>
                    </div>

                    {/* Key Features */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 p-4 rounded-xl text-center hover:shadow-md transition group">
                            <HomeIcon className="w-6 h-6 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition" />
                            <p className="font-semibold">{property.bedroom} Bedrooms</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl text-center hover:shadow-md transition group">
                            <UserIcon className="w-6 h-6 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition" />
                            <p className="font-semibold">{property.bathroom} Bathrooms</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl text-center hover:shadow-md transition group">
                            <BuildingOfficeIcon className="w-6 h-6 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition" />
                            <p className="font-semibold">{property.total_area}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl text-center hover:shadow-md transition group">
                            <svg className="w-6 h-6 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <p className="font-semibold">{property.parking_space} Parking</p>
                        </div>
                    </div>

                    {/* Additional Details Row */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm">
                            <DocumentTextIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Built: {property.yearBuilt}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                            <span className="text-gray-600">Title: Available</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <ShieldCheckIcon className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-600">Insurance: Included</span>
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                            <SparklesIcon className="w-3 h-3" /> {property.type}
                        </span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">{property.category}</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">{property.payment_plan}</span>
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">{property.furnishing}</span>
                        {property.is_verified && (
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium flex items-center gap-1">
                                <ShieldCheckIcon className="w-3 h-3" /> Verified
                            </span>
                        )}
                        {property.featured && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium flex items-center gap-1">
                                <StarIcon className="w-3 h-3" /> Featured
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-3">Description</h2>
                        <p className="text-gray-600 leading-relaxed">{property.description}</p>
                        {property.disclaimer && <p className="text-sm text-gray-400 mt-2 italic">ℹ️ {property.disclaimer}</p>}
                    </div>

                    {/* Amenities */}
                    {amenities.length > 0 && (
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-3">Amenities & Features</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {amenities.map((amenity, idx) => (
                                    <span key={idx} className="px-3 py-2 bg-gray-50 rounded-xl text-sm flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                                        {amenity.replace(/_/g, " ").toLowerCase()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reviews */}
                    <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Reviews ({reviews.length})</h2>
                            <div className="flex items-center gap-1">
                                <StarIcon className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                <span className="font-semibold">4.8</span>
                                <span className="text-gray-400">/5</span>
                            </div>
                        </div>
                        {user ? (
                            <form onSubmit={handleReview} className="mb-6">
                                <textarea 
                                    value={newReview} 
                                    onChange={(e) => setNewReview(e.target.value)} 
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                                    rows="3" 
                                    placeholder="Share your experience with this property..." 
                                    required 
                                />
                                <button 
                                    type="submit" 
                                    disabled={submitting} 
                                    className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                    {submitting ? "Posting..." : "Post Review"}
                                </button>
                            </form>
                        ) : (
                            <div className="bg-gray-50 rounded-xl p-6 text-center mb-6">
                                <p className="text-gray-600">
                                    <Link href="/tenant/login" className="text-blue-600 hover:underline">Login</Link> to leave a review
                                </p>
                            </div>
                        )}
                        <div className="space-y-4">
                            {reviews.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                            ) : (
                                reviews.map((review) => (
                                    <div key={review.id} className="border-b pb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                <UserIcon className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <span className="font-semibold">{review.userName}</span>
                                            <span className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-600 ml-10">{review.text}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Booking Card */}
                <div className="lg:col-span-1">
                    {/* Booking Card */}
                    <div className="bg-white border rounded-2xl p-6 sticky top-24 shadow-lg mb-6">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5" /> Book a Viewing
                        </h3>
                        {!showBookingForm ? (
                            <div className="space-y-4">
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <p className="text-sm text-blue-800 flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4" /> Free consultation
                                    </p>
                                    <p className="text-sm text-blue-800 mt-2 flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4" /> Flexible viewing times
                                    </p>
                                    <p className="text-sm text-blue-800 mt-2 flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4" /> No obligation
                                    </p>
                                </div>
                                <button 
                                    onClick={() => setShowBookingForm(true)} 
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                                >
                                    Book Appointment
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleBooking}>
                                {bookingError && (
                                    <div className="mb-4 bg-red-50 border border-red-400 text-red-700 px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                                        <XCircleIcon className="w-4 h-4" /> {bookingError}
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                                            <CalendarIcon className="w-4 h-4" /> Select Date
                                        </label>
                                        <input 
                                            type="date" 
                                            required 
                                            value={bookingData.date} 
                                            onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })} 
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                                            min={new Date().toISOString().split("T")[0]} 
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                                                <ClockIcon className="w-4 h-4" /> From
                                            </label>
                                            <input 
                                                type="time" 
                                                value={bookingData.time.from} 
                                                onChange={(e) => setBookingData({ ...bookingData, time: { ...bookingData.time, from: e.target.value } })} 
                                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                                                <ClockIcon className="w-4 h-4" /> To
                                            </label>
                                            <input 
                                                type="time" 
                                                value={bookingData.time.to} 
                                                onChange={(e) => setBookingData({ ...bookingData, time: { ...bookingData.time, to: e.target.value } })} 
                                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Additional Notes</label>
                                        <textarea 
                                            value={bookingData.msg} 
                                            onChange={(e) => setBookingData({ ...bookingData, msg: e.target.value })} 
                                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                                            rows="3" 
                                            placeholder="Any questions?" 
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button 
                                            type="button" 
                                            onClick={() => setShowBookingForm(false)} 
                                            className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-200 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={submitting} 
                                            className="flex-1 bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                                        >
                                            {submitting ? "Booking..." : "Confirm"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* Agent Info Card */}
                    {property.agent && (
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <UserIcon className="w-5 h-5" /> Listed by
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="font-semibold text-gray-900">{property.agent}</p>
                                    <p className="text-sm text-gray-500">Licensed Real Estate Agent</p>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                                    <a href={`tel:${property.agentPhone}`} className="text-blue-600 hover:underline">
                                        {property.agentPhone}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                    <a href={`mailto:${property.agentEmail}`} className="text-blue-600 hover:underline">
                                        {property.agentEmail}
                                    </a>
                                </div>
                            </div>
                            <button className="w-full mt-4 border border-blue-600 text-blue-600 py-2 rounded-xl font-medium hover:bg-blue-50 transition">
                                Contact Agent
                            </button>
                        </div>
                    )}

                   
                </div>
            </div>
        </div>
    );
}