"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const BASE = "http://property.reworkstaging.name.ng/v1";

// Custom Toast Component
function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            <div className="bg-gray-800 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[280px]">
                {type === "success" ? (
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
                <span className="text-sm font-medium">{message}</span>
                <button onClick={onClose} className="ml-auto hover:text-gray-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

// Color Palette from your image
const COLORS = {
  primary: '#6E473B',
  secondary: '#BE85A9',
  background: '#F5F0ED',
  cardBg: '#FFFFFF',
  textLight: '#A7807B',
  textDark: '#291COE',
  border: '#E1D4C2'
};

// SVG Icon Components
const IconMapPin = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const IconBed = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconBath = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconParking = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconMaximize = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" /></svg>;
const IconCalendar = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconCheck = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconStar = () => <svg className="w-4 h-4 fill-current" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const IconHeart = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const IconHeartSolid = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const IconShare = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>;
const IconArrowLeft = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>;
const IconUser = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const IconPhone = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const IconMail = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const IconHome = () => <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;

function extractImageUrl(prop) {
    if (!prop) return null;
    const ok = (v) => typeof v === "string" && v.length > 4 &&
        (v.startsWith("http") || v.startsWith("/") || /\.(jpg|jpeg|png|webp|gif|svg)/i.test(v));
    const fromItem = (item) => {
        if (!item) return null;
        if (ok(item)) return item;
        if (typeof item === "object") {
            for (const k of ["url", "uri", "path", "src", "image", "link", "file", "resource", "secure_url"])
                if (ok(item[k])) return item[k];
        }
        return null;
    };
    const fromArr = (arr) => {
        if (!Array.isArray(arr) || !arr.length) return null;
        for (const item of arr) { const u = fromItem(item); if (u) return u; }
        return null;
    };
    return fromArr(prop.resources) || fromArr(prop.images) || fromArr(prop.media) ||
        fromArr(prop.photos) || fromArr(prop.files) ||
        fromItem(prop.image) || fromItem(prop.thumbnail) || fromItem(prop.photo) || null;
}

export default function PropertyDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showBooking, setShowBooking] = useState(false);
    const [bookingDate, setBookingDate] = useState("");
    const [bookingTime, setBookingTime] = useState("");
    const [bookingMsg, setBookingMsg] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [user, setUser] = useState(null);
    const [isWishlist, setIsWishlist] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            try { setUser(JSON.parse(userData)); } catch {}
        }
        if (id) {
            fetchProperty();
        }
    }, [id]);

    const fetchProperty = async () => {
        try {
            setLoading(true);
            let token = localStorage.getItem("admin_token") || localStorage.getItem("token");
            
            if (!token) {
                try {
                    const tokenRes = await fetch(`${BASE}/token`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: "d@g.com" })
                    });
                    const tokenData = await tokenRes.json();
                    token = tokenData.token;
                } catch (err) {
                    console.error("Token fetch error:", err);
                }
            }
            
            const headers = token ? { "Authorization": `Bearer ${token}` } : {};
            const res = await fetch(`${BASE}/properties/${id}`, { headers });
            
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            
            const data = await res.json();
            const propertyData = data.data || data;
            
            if (propertyData && (propertyData._id || propertyData.id)) {
                setProperty(propertyData);
            } else {
                setError("Property not found");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("Failed to load property");
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async (e) => {
        e.preventDefault();
        
        if (!user) {
            showToast("Please login to book a viewing", "error");
            router.push("/tenant/login");
            return;
        }
        
        setSubmitting(true);
        const token = localStorage.getItem("token");
        
        try {
            const res = await fetch(`${BASE}/appointments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    property_id: property._id,
                    user_id: user._id || user.id,
                    date: bookingDate,
                    msg: bookingMsg,
                    time: { from: bookingTime || "10:00", to: "12:00" }
                })
            });
            
            if (res.ok) {
                showToast("Appointment booked successfully!", "success");
                setShowBooking(false);
                setBookingDate("");
                setBookingTime("");
                setBookingMsg("");
            } else {
                showToast("Failed to book appointment", "error");
            }
        } catch (err) {
            showToast("Error booking appointment", "error");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleWishlist = () => {
        if (!user) {
            showToast("Please login to add to wishlist", "error");
            router.push("/tenant/login");
            return;
        }
        setIsWishlist(!isWishlist);
        showToast(isWishlist ? "Removed from wishlist" : "Added to wishlist", "success");
    };

    const shareProperty = () => {
        navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard!", "success");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center" style={{ backgroundColor: COLORS.background }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: COLORS.primary }}></div>
                    <p style={{ color: COLORS.textDark }}>Loading property...</p>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-screen flex justify-center items-center" style={{ backgroundColor: COLORS.background }}>
                <div className="text-center p-8 rounded-2xl" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke={COLORS.primary} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.textDark }}>Property Not Found</h2>
                    <p className="mb-6" style={{ color: COLORS.textLight }}>{error || "The property you're looking for doesn't exist."}</p>
                    <Link href="/public/properties">
                        <button className="px-6 py-2 rounded-xl font-semibold transition hover:opacity-90" style={{ backgroundColor: COLORS.primary, color: '#fff' }}>
                            Back to Properties
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const imageUrl = extractImageUrl(property);
    const price = parseInt(String(property.price || "0").replace(/,/g, ""));
    const avgRating = 4.8;

    return (
        <div className="min-h-screen py-8" style={{ backgroundColor: COLORS.background }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top Navigation */}
                <div className="flex justify-between items-center mb-6">
                    <Link href="/public/properties" className="flex items-center gap-2 transition hover:opacity-70" style={{ color: COLORS.primary }}>
                        <IconArrowLeft />
                        <span>Back to Properties</span>
                    </Link>
                    <div className="flex gap-3">
                        <button onClick={shareProperty} className="p-2 rounded-full transition hover:bg-opacity-10" style={{ backgroundColor: `${COLORS.primary}10`, color: COLORS.primary }}>
                            <IconShare />
                        </button>
                        <button onClick={toggleWishlist} className="p-2 rounded-full transition hover:bg-opacity-10" style={{ backgroundColor: `${COLORS.primary}10`, color: COLORS.primary }}>
                            {isWishlist ? <IconHeartSolid /> : <IconHeart />}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Images & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Main Image */}
                        <div className="rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: COLORS.cardBg }}>
                            <div className="h-96 bg-gray-100">
                                {imageUrl ? (
                                    <img src={imageUrl} alt={property.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <IconHome />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Property Info Card */}
                        <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: COLORS.cardBg }}>
                            <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.textDark }}>{property.name}</h1>
                            
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-1" style={{ color: COLORS.textLight }}>
                                    <IconMapPin />
                                    <span className="text-sm">{property.address || `${property.city || ''}, ${property.state || ''}`}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} style={{ color: i < Math.floor(avgRating) ? COLORS.secondary : COLORS.textLight }}><IconStar /></span>
                                    ))}
                                    <span className="text-sm ml-1" style={{ color: COLORS.textDark }}>{avgRating}</span>
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <p className="text-3xl font-bold" style={{ color: COLORS.primary }}>
                                    ₦{isNaN(price) ? property.price : price.toLocaleString()}
                                </p>
                                {property.type === "RENT" && property.payment_plan && (
                                    <p className="text-sm mt-1" style={{ color: COLORS.textLight }}>{property.payment_plan.replace(/_/g, " ")}</p>
                                )}
                            </div>

                            {/* Features Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="p-4 rounded-xl text-center transition hover:shadow" style={{ backgroundColor: `${COLORS.primary}08` }}>
                                    <div className="flex justify-center mb-2" style={{ color: COLORS.primary }}><IconBed /></div>
                                    <p className="text-sm" style={{ color: COLORS.textLight }}>Bedrooms</p>
                                    <p className="font-bold text-lg" style={{ color: COLORS.textDark }}>{property.bedroom || 0}</p>
                                </div>
                                <div className="p-4 rounded-xl text-center transition hover:shadow" style={{ backgroundColor: `${COLORS.primary}08` }}>
                                    <div className="flex justify-center mb-2" style={{ color: COLORS.primary }}><IconBath /></div>
                                    <p className="text-sm" style={{ color: COLORS.textLight }}>Bathrooms</p>
                                    <p className="font-bold text-lg" style={{ color: COLORS.textDark }}>{property.bathroom || 0}</p>
                                </div>
                                <div className="p-4 rounded-xl text-center transition hover:shadow" style={{ backgroundColor: `${COLORS.primary}08` }}>
                                    <div className="flex justify-center mb-2" style={{ color: COLORS.primary }}><IconParking /></div>
                                    <p className="text-sm" style={{ color: COLORS.textLight }}>Parking</p>
                                    <p className="font-bold text-lg" style={{ color: COLORS.textDark }}>{property.parking_space || 0}</p>
                                </div>
                                <div className="p-4 rounded-xl text-center transition hover:shadow" style={{ backgroundColor: `${COLORS.primary}08` }}>
                                    <div className="flex justify-center mb-2" style={{ color: COLORS.primary }}><IconMaximize /></div>
                                    <p className="text-sm" style={{ color: COLORS.textLight }}>Area</p>
                                    <p className="font-bold text-lg" style={{ color: COLORS.textDark }}>{property.total_area || "—"}</p>
                                </div>
                            </div>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {property.type && (
                                    <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${COLORS.primary}15`, color: COLORS.primary }}>
                                        {property.type}
                                    </span>
                                )}
                                {property.category && (
                                    <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${COLORS.secondary}15`, color: COLORS.secondary }}>
                                        {property.category}
                                    </span>
                                )}
                                {property.is_verified && (
                                    <span className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1" style={{ backgroundColor: `${COLORS.primary}10`, color: COLORS.primary }}>
                                        <IconCheck /> Verified
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            {property.description && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.textDark }}>Description</h2>
                                    <p className="leading-relaxed" style={{ color: COLORS.textLight }}>{property.description}</p>
                                </div>
                            )}

                            {/* Amenities */}
                            {property.amenities && property.amenities.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-3" style={{ color: COLORS.textDark }}>Amenities</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {property.amenities.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <IconCheck />
                                                <span className="text-sm" style={{ color: COLORS.textLight }}>{typeof item === 'string' ? item.toLowerCase().replace(/_/g, " ") : item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Booking Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 rounded-2xl p-6 shadow-lg" style={{ backgroundColor: COLORS.cardBg }}>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: COLORS.textDark }}>
                                <IconCalendar />
                                Schedule a Viewing
                            </h3>
                            
                            {!showBooking ? (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl" style={{ backgroundColor: `${COLORS.primary}05` }}>
                                        <p className="flex items-center gap-2 text-sm mb-2" style={{ color: COLORS.textDark }}>
                                            <IconCheck /> Free consultation
                                        </p>
                                        <p className="flex items-center gap-2 text-sm mb-2" style={{ color: COLORS.textDark }}>
                                            <IconCheck /> Flexible viewing times
                                        </p>
                                        <p className="flex items-center gap-2 text-sm" style={{ color: COLORS.textDark }}>
                                            <IconCheck /> No obligation
                                        </p>
                                    </div>
                                    
                                    <button 
                                        onClick={() => setShowBooking(true)}
                                        className="w-full py-3 rounded-xl font-semibold transition hover:opacity-90"
                                        style={{ backgroundColor: COLORS.primary, color: '#fff' }}
                                    >
                                        Book Appointment
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleBooking} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1" style={{ color: COLORS.textDark }}>Select Date</label>
                                        <input 
                                            type="date" 
                                            required 
                                            value={bookingDate}
                                            onChange={(e) => setBookingDate(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                                            style={{ borderColor: COLORS.border, backgroundColor: COLORS.cardBg, color: COLORS.textDark }}
                                            min={new Date().toISOString().split("T")[0]}
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-1" style={{ color: COLORS.textDark }}>Preferred Time</label>
                                        <select 
                                            value={bookingTime}
                                            onChange={(e) => setBookingTime(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                                            style={{ borderColor: COLORS.border, backgroundColor: COLORS.cardBg, color: COLORS.textDark }}
                                        >
                                            <option value="">Select time</option>
                                            <option value="09:00">9:00 AM</option>
                                            <option value="11:00">11:00 AM</option>
                                            <option value="14:00">2:00 PM</option>
                                            <option value="16:00">4:00 PM</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium mb-1" style={{ color: COLORS.textDark }}>Additional Notes</label>
                                        <textarea 
                                            value={bookingMsg}
                                            onChange={(e) => setBookingMsg(e.target.value)}
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                                            rows="3"
                                            placeholder="Any questions or special requests?"
                                            style={{ borderColor: COLORS.border, backgroundColor: COLORS.cardBg, color: COLORS.textDark }}
                                        />
                                    </div>
                                    
                                    <div className="flex gap-3 pt-2">
                                        <button 
                                            type="button" 
                                            onClick={() => setShowBooking(false)}
                                            className="flex-1 py-2 rounded-lg font-semibold transition hover:bg-opacity-10"
                                            style={{ backgroundColor: `${COLORS.primary}10`, color: COLORS.primary }}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            disabled={submitting}
                                            className="flex-1 py-2 rounded-lg font-semibold transition hover:opacity-90 disabled:opacity-50"
                                            style={{ backgroundColor: COLORS.primary, color: '#fff' }}
                                        >
                                            {submitting ? "Booking..." : "Confirm"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Agent Contact Card */}
                        <div className="mt-6 rounded-2xl p-6 shadow-lg" style={{ backgroundColor: COLORS.cardBg }}>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: COLORS.textDark }}>
                                <IconUser />
                                Property Agent
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${COLORS.primary}15` }}>
                                        <IconUser />
                                    </div>
                                    <div>
                                        <p className="font-semibold" style={{ color: COLORS.textDark }}>Professional Agent</p>
                                        <p className="text-sm" style={{ color: COLORS.textLight }}>Licensed Real Estate Agent</p>
                                    </div>
                                </div>
                                <div className="pt-3 border-t" style={{ borderColor: COLORS.border }}>
                                    <p className="flex items-center gap-2 text-sm mb-2" style={{ color: COLORS.textLight }}>
                                        <IconPhone />
                                        +234 801 234 5678
                                    </p>
                                    <p className="flex items-center gap-2 text-sm" style={{ color: COLORS.textLight }}>
                                        <IconMail />
                                        agent@realestate.com
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}