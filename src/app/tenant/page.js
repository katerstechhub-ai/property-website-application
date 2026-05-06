"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    CalendarDaysIcon,
    HeartIcon,
    ClockIcon,
    HomeIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    CheckCircleIcon,
    XCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    BuildingOfficeIcon,
    TrashIcon,
    EyeIcon,
    CalendarIcon,
    StarIcon,
    BriefcaseIcon,
} from "@heroicons/react/24/outline";

const COLORS = {
    primary: '#6E473B',
    secondary: '#BE85A9',
    background: '#F5F0ED',
    cardBg: '#FFFFFF',
    textLight: '#A7807B',
    textDark: '#3D2B1F',
    border: '#E1D4C2'
};

const BASE = "http://property.reworkstaging.name.ng/v1";

// Same extractImageUrl function from PropertiesPage
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

// Simple Property Modal with better error handling
function PropertyModal({ property, onClose }) {
    const [activeImage, setActiveImage] = useState(0);
    const [imgError, setImgError] = useState(false);
    
    if (!property) return null;

    const imageUrl = extractImageUrl(property);
    const images = property.images || [];
    const mainImage = images[activeImage] || imageUrl;
    const price = parseInt(String(property.price || "0").replace(/,/g, ""));

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl"
                style={{ backgroundColor: COLORS.cardBg }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/90 hover:bg-red-50 text-gray-500 hover:text-red-600 shadow transition"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="relative w-full h-52 bg-gray-100 rounded-t-2xl overflow-hidden">
                    {mainImage && !imgError ? (
                        <img 
                            src={mainImage} 
                            alt={property.name} 
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">🏠</div>
                    )}
                    <span
                        className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-semibold text-white"
                        style={{ backgroundColor: COLORS.primary }}
                    >
                        {property.type || "Property"}
                    </span>
                </div>

                <div className="p-5 space-y-4">
                    <h2 className="text-xl font-bold" style={{ color: COLORS.textDark }}>{property.name || "Unnamed Property"}</h2>

                    <div className="flex items-center gap-1 text-sm" style={{ color: COLORS.textLight }}>
                        <MapPinIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">
                            {property.address || [property.city, property.state].filter(Boolean).join(", ") || "Location not available"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-b py-3" style={{ borderColor: COLORS.border }}>
                        <div>
                            <p className="text-xs text-gray-400">Price</p>
                            <p className="text-xl font-bold" style={{ color: COLORS.primary }}>
                                ₦{isNaN(price) ? (property.price || "—") : price.toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Area</p>
                            <p className="font-semibold text-sm" style={{ color: COLORS.textDark }}>{property.total_area || "—"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Payment</p>
                            <p className="font-semibold text-sm" style={{ color: COLORS.textDark }}>
                                {property.payment_plan?.replace(/_/g, " ") || "—"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="rounded-xl py-2" style={{ backgroundColor: COLORS.background }}>
                            <p className="font-bold text-base" style={{ color: COLORS.textDark }}>{property.bedroom ?? 0}</p>
                            <p className="text-xs text-gray-400">Beds</p>
                        </div>
                        <div className="rounded-xl py-2" style={{ backgroundColor: COLORS.background }}>
                            <p className="font-bold text-base" style={{ color: COLORS.textDark }}>{property.bathroom ?? 0}</p>
                            <p className="text-xs text-gray-400">Baths</p>
                        </div>
                        <div className="rounded-xl py-2" style={{ backgroundColor: COLORS.background }}>
                            <p className="font-bold text-base" style={{ color: COLORS.textDark }}>{property.toilet ?? 0}</p>
                            <p className="text-xs text-gray-400">Toilets</p>
                        </div>
                        <div className="rounded-xl py-2" style={{ backgroundColor: COLORS.background }}>
                            <p className="font-bold text-base" style={{ color: COLORS.textDark }}>{property.parking_space ?? 0}</p>
                            <p className="text-xs text-gray-400">Parking</p>
                        </div>
                    </div>

                    {property.description && (
                        <p className="text-sm leading-relaxed line-clamp-4" style={{ color: COLORS.textLight }}>
                            {property.description}
                        </p>
                    )}

                    {Array.isArray(property.amenities) && property.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {property.amenities.slice(0, 6).map((item, idx) => (
                                <span
                                    key={`amenity-${idx}`}
                                    className="text-xs px-2.5 py-1 rounded-full"
                                    style={{ backgroundColor: `${COLORS.primary}15`, color: COLORS.primary }}
                                >
                                    {typeof item === "string" ? item.toLowerCase().replace(/_/g, " ") : item}
                                </span>
                            ))}
                            {property.amenities.length > 6 && (
                                <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: `${COLORS.primary}15`, color: COLORS.primary }}>
                                    +{property.amenities.length - 6} more
                                </span>
                            )}
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full py-2.5 rounded-xl font-semibold text-white transition hover:opacity-90 mt-2"
                        style={{ backgroundColor: COLORS.primary }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function TenantDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [debug, setDebug] = useState("");

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            router.push("/tenant/login");
            return;
        }
        const parsed = JSON.parse(userData);
        if (parsed.role === "MERCHANT") {
            router.push("/tenant/login");
            return;
        }
        setUser(parsed);
        fetchData(parsed);
    }, []);

    const getPublicToken = async () => {
        try {
            const res = await fetch(`${BASE}/token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: "d@g.com" })
            });
            const data = await res.json();
            return data.token || null;
        } catch (err) {
            console.error("Public token error:", err);
            return null;
        }
    };

    const fetchPropertyWithFallback = async (propertyId, publicToken, token) => {
        try {
            // Try with public token first
            let res = await fetch(`${BASE}/properties/${propertyId}`, {
                headers: { "Authorization": `Bearer ${publicToken}` }
            });
            
            // Check if response is JSON (not HTML error page)
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("Non-JSON response for property:", propertyId);
                return null;
            }
            
            const data = await res.json();
            return data.data || data;
        } catch (err) {
            console.error(`Error fetching property ${propertyId}:`, err);
            return null;
        }
    };

    const fetchData = async (userData) => {
        const token = getToken();
        const userId = userData?.id || userData?._id;
        
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const publicToken = await getPublicToken();
            
            // Fetch appointments
            const aptRes = await fetch(`${BASE}/appointments?user=${userId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            const aptData = await aptRes.json();
            const appointmentsList = aptData.data || [];

            const appointmentsWithDetails = [];
            for (const apt of appointmentsList) {
                if (!apt.property_id) {
                    appointmentsWithDetails.push(apt);
                    continue;
                }
                const property = await fetchPropertyWithFallback(apt.property_id, publicToken, token);
                appointmentsWithDetails.push({ 
                    ...apt, 
                    property: property,
                    propertyImage: property ? extractImageUrl(property) : null
                });
            }
            setAppointments(appointmentsWithDetails);

            // Fetch wishlist
            const wishlistRes = await fetch(`${BASE}/users/${userId}/wishlist`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            
            const wishlistData = await wishlistRes.json();
            const wishlistItems = wishlistData.data || [];

            const wishlistProperties = [];
            for (const item of wishlistItems) {
                const property = await fetchPropertyWithFallback(item.property_id, publicToken, token);
                if (property) {
                    wishlistProperties.push({
                        ...property,
                        wishlist_id: item._id,
                        imageUrl: extractImageUrl(property)
                    });
                }
            }
            setWishlist(wishlistProperties);
            setDebug(`Loaded ${appointmentsList.length} appointments, ${wishlistItems.length} wishlist items`);
        } catch (err) {
            console.error("Error fetching tenant data:", err);
            setDebug(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const openPropertyModal = (property) => {
        if (!property) return;
        setSelectedProperty(property);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProperty(null);
    };

    const confirmAppointment = async (appointmentId) => {
        const token = getToken();
        try {
            const res = await fetch(`${BASE}/appointments/${appointmentId}/set-user-appointment-completion`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.code === 200 || res.ok) {
                setAppointments(prev =>
                    prev.map(apt => apt._id === appointmentId ? { ...apt, status: "completed" } : apt)
                );
            }
        } catch (err) {
            console.error("Error confirming appointment:", err);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        if (!confirm("Cancel this appointment?")) return;
        const token = getToken();
        try {
            const res = await fetch(`${BASE}/appointments/${appointmentId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.code === 200 || res.ok) {
                setAppointments(prev => prev.filter(apt => apt._id !== appointmentId));
            }
        } catch (err) {
            console.error("Error canceling appointment:", err);
        }
    };

    const removeFromWishlist = async (propertyId) => {
        if (!confirm("Remove from wishlist?")) return;
        const token = getToken();
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = userData?.id || userData?._id;
        
        try {
            const res = await fetch(`${BASE}/users/${userId}/wishlist/${propertyId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.code === 200 || res.ok) {
                setWishlist(prev => prev.filter(p => p._id !== propertyId));
            }
        } catch (err) {
            console.error("Error removing wishlist:", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/public");
    };

    const getStatusBadge = (status) => {
        const config = {
            pending:   { bg: "bg-amber-100",  text: "text-amber-700",  Icon: ClockIcon,        label: "Pending" },
            accepted:  { bg: "bg-green-100",  text: "text-green-700",  Icon: CheckCircleIcon,  label: "Accepted" },
            rejected:  { bg: "bg-red-100",    text: "text-red-700",    Icon: XCircleIcon,      label: "Rejected" },
            completed: { bg: "bg-blue-100",   text: "text-blue-700",   Icon: CheckCircleIcon,  label: "Completed" },
        };
        const s = config[status?.toLowerCase()] || config.pending;
        const { Icon } = s;
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                <Icon className="w-3 h-3" />
                {s.label}
            </span>
        );
    };

    const statsConfig = [
        { id: "appointments", Icon: CalendarDaysIcon, value: appointments.length, label: "Appointments" },
        { id: "saved", Icon: HeartIcon, value: wishlist.length, label: "Saved Properties" },
        { id: "pending", Icon: ClockIcon, value: appointments.filter(a => a.status?.toLowerCase() === "pending").length, label: "Pending" },
    ];

    const tabs = [
        { id: "overview", label: "Overview", Icon: HomeIcon },
        { id: "appointments", label: "Appointments", Icon: CalendarDaysIcon, count: appointments.filter(a => a.status?.toLowerCase() === "pending").length },
        { id: "wishlist", label: "Wishlist", Icon: HeartIcon, count: wishlist.length },
        { id: "profile", label: "Profile", Icon: UserCircleIcon },
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center" style={{ backgroundColor: COLORS.background }}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: COLORS.primary }} />
                    <p className="text-gray-500">Loading your dashboard...</p>
                    {debug && <p className="text-xs text-gray-400 mt-2">{debug}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: COLORS.background }}>

            {/* Property Modal */}
            {isModalOpen && selectedProperty && (
                <PropertyModal property={selectedProperty} onClose={closeModal} />
            )}

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}
                >
                    <div
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.85) 100%)" }}
                    />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border border-white/30">
                                <UserCircleIcon className="w-9 h-9 text-white" />
                            </div>
                            <div>
                                <p className="text-white/80 text-sm">Welcome back,</p>
                                <h1 className="text-2xl font-bold text-white">{user?.first_name} {user?.last_name}</h1>
                                <p className="text-white/70 text-sm flex items-center gap-1 mt-1">
                                    <EnvelopeIcon className="w-3 h-3" /> {user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Link href="/public">
                                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
                                    <HomeIcon className="w-4 h-4" />
                                    Browse Properties
                                </button>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                            >
                                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        {statsConfig.map((stat) => (
                            <div key={stat.id} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/20">
                                <stat.Icon className="w-6 h-6 text-white/80 mx-auto mb-1" />
                                <p className="text-2xl font-bold text-white">{stat.value}</p>
                                <p className="text-white/70 text-xs">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden" style={{ border: `1px solid ${COLORS.border}` }}>
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition border-b-2 ${
                                    activeTab === tab.id
                                        ? "border-red-600 text-red-600 bg-red-50"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                                <tab.Icon className="w-4 h-4" />
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── OVERVIEW TAB ── */}
                {activeTab === "overview" && (
                    <div className="space-y-6">
                        {/* Recent Appointments */}
                        <div className="bg-white rounded-2xl shadow-sm p-6" style={{ border: `1px solid ${COLORS.border}` }}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.textDark }}>
                                    <CalendarDaysIcon className="w-5 h-5 text-red-600" />
                                    Recent Appointments
                                </h2>
                                <button onClick={() => setActiveTab("appointments")} className="text-red-600 text-sm hover:underline">
                                    View all
                                </button>
                            </div>
                            {appointments.length === 0 ? (
                                <div className="text-center py-8">
                                    <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 mb-3">No appointments yet</p>
                                    <Link href="/public/properties" className="text-red-600 text-sm hover:underline">
                                        Browse properties to book a viewing →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {appointments.slice(0, 3).map((apt, idx) => (
                                        <div
                                            key={apt._id || `apt-${idx}`}
                                            className="flex justify-between items-center p-4 rounded-xl"
                                            style={{ backgroundColor: COLORS.background }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                                    style={{ backgroundColor: `${COLORS.primary}10` }}
                                                >
                                                    {apt.propertyImage ? (
                                                        <img src={apt.propertyImage} className="w-6 h-6 rounded-lg object-cover" alt="" />
                                                    ) : (
                                                        <BuildingOfficeIcon className="w-5 h-5" style={{ color: COLORS.primary }} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm" style={{ color: COLORS.textDark }}>
                                                        {apt.property?.name || "Property"}
                                                    </p>
                                                    <p className="text-xs flex items-center gap-1" style={{ color: COLORS.textLight }}>
                                                        <CalendarDaysIcon className="w-3 h-3" />
                                                        {apt.date} • {apt.time?.from} - {apt.time?.to}
                                                    </p>
                                                </div>
                                            </div>
                                            {getStatusBadge(apt.status)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Saved Properties Preview */}
                        <div className="bg-white rounded-2xl shadow-sm p-6" style={{ border: `1px solid ${COLORS.border}` }}>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: COLORS.textDark }}>
                                    <HeartIcon className="w-5 h-5 text-red-500" />
                                    Saved Properties
                                </h2>
                                <button onClick={() => setActiveTab("wishlist")} className="text-red-600 text-sm hover:underline">
                                    View all
                                </button>
                            </div>
                            {wishlist.length === 0 ? (
                                <div className="text-center py-8">
                                    <HeartIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 mb-3">No saved properties</p>
                                    <Link href="/public/properties" className="text-red-600 text-sm hover:underline">
                                        Explore properties →
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {wishlist.slice(0, 2).map((property, idx) => (
                                        <div
                                            key={property._id || `wish-${idx}`}
                                            className="flex gap-3 p-3 rounded-xl transition hover:shadow-md cursor-pointer"
                                            style={{ border: `1px solid ${COLORS.border}` }}
                                            onClick={() => openPropertyModal(property)}
                                        >
                                            <div
                                                className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0"
                                                style={{ backgroundColor: `${COLORS.primary}10` }}
                                            >
                                                {property.imageUrl ? (
                                                    <img src={property.imageUrl} className="w-full h-full object-cover" alt={property.name} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <HomeIcon className="w-8 h-8" style={{ color: COLORS.textLight }} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-sm line-clamp-1" style={{ color: COLORS.textDark }}>{property.name}</p>
                                                <p className="text-xs flex items-center gap-1 mt-1" style={{ color: COLORS.textLight }}>
                                                    <MapPinIcon className="w-3 h-3" /> {property.city}, {property.state}
                                                </p>
                                                <p className="font-bold text-sm mt-1" style={{ color: COLORS.primary }}>
                                                    ₦{typeof property.price === 'number' ? property.price.toLocaleString() : property.price}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── APPOINTMENTS TAB ── */}
                {activeTab === "appointments" && (
                    <div className="space-y-4">
                        {appointments.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm p-12 text-center" style={{ border: `1px solid ${COLORS.border}` }}>
                                <CalendarDaysIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.textDark }}>No Appointments Yet</h3>
                                <p className="text-gray-500 mb-4">Book your first property viewing</p>
                                <Link href="/public/properties">
                                    <button className="px-6 py-2 rounded-xl font-semibold text-white transition" style={{ backgroundColor: COLORS.primary }}>
                                        Browse Properties
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            appointments.map((apt, idx) => {
                                const status = apt.status?.toLowerCase();
                                const hasProperty = !!apt.property;

                                return (
                                    <div
                                        key={apt._id || `apt-full-${idx}`}
                                        className="bg-white rounded-2xl shadow-sm p-6"
                                        style={{ border: `1px solid ${COLORS.border}` }}
                                    >
                                        <div className="flex flex-wrap justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-3 flex-wrap">
                                                    <div
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                                        style={{ backgroundColor: `${COLORS.primary}10` }}
                                                    >
                                                        {apt.propertyImage ? (
                                                            <img src={apt.propertyImage} className="w-6 h-6 rounded-lg object-cover" alt="" />
                                                        ) : (
                                                            <BuildingOfficeIcon className="w-5 h-5" style={{ color: COLORS.primary }} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold truncate" style={{ color: COLORS.textDark }}>
                                                            {apt.property?.name || "Property"}
                                                        </h3>
                                                        <p className="text-xs flex items-center gap-1 truncate" style={{ color: COLORS.textLight }}>
                                                            <MapPinIcon className="w-3 h-3 flex-shrink-0" />
                                                            {apt.property?.address || [apt.property?.city, apt.property?.state].filter(Boolean).join(", ") || "—"}
                                                        </p>
                                                    </div>
                                                    {getStatusBadge(apt.status)}
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                                                    <div className="rounded-lg p-3" style={{ backgroundColor: COLORS.background }}>
                                                        <p className="text-xs text-gray-500 mb-1">Date</p>
                                                        <p className="font-medium text-sm" style={{ color: COLORS.textDark }}>{apt.date}</p>
                                                    </div>
                                                    <div className="rounded-lg p-3" style={{ backgroundColor: COLORS.background }}>
                                                        <p className="text-xs text-gray-500 mb-1">Time</p>
                                                        <p className="font-medium text-sm" style={{ color: COLORS.textDark }}>{apt.time?.from} - {apt.time?.to}</p>
                                                    </div>
                                                    <div className="rounded-lg p-3" style={{ backgroundColor: COLORS.background }}>
                                                        <p className="text-xs text-gray-500 mb-1">Type</p>
                                                        <p className="font-medium text-sm" style={{ color: COLORS.textDark }}>{apt.property?.type || "—"}</p>
                                                    </div>
                                                </div>

                                                {apt.msg && (
                                                    <div className="p-3 rounded-xl text-sm" style={{ backgroundColor: `${COLORS.primary}10`, color: COLORS.primary }}>
                                                        <span className="font-semibold">Note:</span> {apt.msg}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2 min-w-[140px]">
                                                <button
                                                    onClick={() => hasProperty && openPropertyModal(apt.property)}
                                                    disabled={!hasProperty}
                                                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                                                        hasProperty ? "hover:opacity-80" : "opacity-40 cursor-not-allowed"
                                                    }`}
                                                    style={{ border: `1px solid ${COLORS.primary}`, color: COLORS.primary }}
                                                >
                                                    <EyeIcon className="w-4 h-4" />
                                                    View Property
                                                </button>

                                                {status === "accepted" && (
                                                    <button
                                                        onClick={() => confirmAppointment(apt._id)}
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                                                        style={{ backgroundColor: '#065f46' }}
                                                    >
                                                        <CheckCircleIcon className="w-4 h-4" /> Confirm Done
                                                    </button>
                                                )}
                                                {status === "pending" && (
                                                    <button
                                                        onClick={() => cancelAppointment(apt._id)}
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition hover:opacity-80"
                                                        style={{ border: "1px solid #dc2626", color: '#dc2626' }}
                                                    >
                                                        <XCircleIcon className="w-4 h-4" /> Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* ── WISHLIST TAB ── */}
                {activeTab === "wishlist" && (
                    <div>
                        {wishlist.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm p-12 text-center" style={{ border: `1px solid ${COLORS.border}` }}>
                                <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.textDark }}>Your Wishlist is Empty</h3>
                                <p className="text-gray-500 mb-4">Save properties you love</p>
                                <Link href="/public/properties">
                                    <button className="px-6 py-2 rounded-xl font-semibold text-white transition" style={{ backgroundColor: COLORS.primary }}>
                                        Explore Properties
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {wishlist.map((property, idx) => (
                                    <div
                                        key={property._id || `wish-full-${idx}`}
                                        className="bg-white rounded-2xl shadow-sm overflow-hidden transition hover:shadow-md cursor-pointer"
                                        style={{ border: `1px solid ${COLORS.border}` }}
                                        onClick={() => openPropertyModal(property)}
                                    >
                                        <div className="h-48 relative overflow-hidden" style={{ backgroundColor: `${COLORS.primary}10` }}>
                                            {property.imageUrl ? (
                                                <img src={property.imageUrl} alt={property.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <HomeIcon className="w-12 h-12" style={{ color: COLORS.textLight }} />
                                                </div>
                                            )}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeFromWishlist(property._id); }}
                                                className="absolute top-3 right-3 bg-white rounded-xl p-2 shadow-md transition hover:bg-red-50"
                                            >
                                                <TrashIcon className="w-4 h-4 text-red-500" />
                                            </button>
                                            <span
                                                className="absolute top-3 left-3 text-white text-xs px-2 py-1 rounded-lg font-medium"
                                                style={{ backgroundColor: COLORS.primary }}
                                            >
                                                {property.type || "Property"}
                                            </span>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-bold text-lg mb-1 line-clamp-1" style={{ color: COLORS.textDark }}>{property.name}</h3>
                                            <p className="text-sm mb-2 flex items-center gap-1" style={{ color: COLORS.textLight }}>
                                                <MapPinIcon className="w-3 h-3" /> {property.city}, {property.state}
                                            </p>
                                            <p className="font-bold text-xl mb-4" style={{ color: COLORS.primary }}>
                                                ₦{typeof property.price === 'number' ? property.price.toLocaleString() : property.price}
                                            </p>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); openPropertyModal(property); }}
                                                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
                                                style={{ backgroundColor: COLORS.primary }}
                                            >
                                                <EyeIcon className="w-4 h-4" /> View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── PROFILE TAB ── */}
                {activeTab === "profile" && user && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: `1px solid ${COLORS.border}` }}>
                            <div
                                className="p-6 text-white"
                                style={{ background: `linear-gradient(135deg, ${COLORS.textDark} 0%, ${COLORS.primary} 100%)` }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center border-2 border-white/30">
                                        <UserCircleIcon className="w-10 h-10 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold">{user?.first_name} {user?.last_name}</h2>
                                        <p className="text-white/80 text-sm flex items-center gap-1 mt-1">
                                            <BriefcaseIcon className="w-4 h-4" /> Tenant Account
                                        </p>
                                        <p className="text-white/70 text-xs mt-1">
                                            Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "2024"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-5">
                                <h3 className="text-md font-semibold flex items-center gap-2" style={{ color: COLORS.textDark }}>
                                    <UserCircleIcon className="w-5 h-5" style={{ color: COLORS.primary }} />
                                    Personal Information
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: COLORS.background }}>
                                        <EnvelopeIcon className="w-5 h-5 flex-shrink-0" style={{ color: COLORS.primary }} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500">Email Address</p>
                                            <p className="font-medium truncate" style={{ color: COLORS.textDark }}>{user?.email || "Not provided"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: COLORS.background }}>
                                        <PhoneIcon className="w-5 h-5 flex-shrink-0" style={{ color: COLORS.primary }} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500">Phone Number</p>
                                            <p className="font-medium truncate" style={{ color: COLORS.textDark }}>{user?.phone || "Not provided"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: COLORS.background }}>
                                        <CalendarIcon className="w-5 h-5 flex-shrink-0" style={{ color: COLORS.primary }} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500">Account Created</p>
                                            <p className="font-medium truncate" style={{ color: COLORS.textDark }}>
                                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "January 1, 2024"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: COLORS.background }}>
                                        <StarIcon className="w-5 h-5 flex-shrink-0" style={{ color: COLORS.primary }} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500">Reviews Written</p>
                                            <p className="font-medium truncate" style={{ color: COLORS.textDark }}>0</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3">
                                    <h3 className="text-md font-semibold flex items-center gap-2 mb-3" style={{ color: COLORS.textDark }}>
                                        <CalendarDaysIcon className="w-5 h-5" style={{ color: COLORS.primary }} />
                                        Activity Summary
                                    </h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="text-center p-3 rounded-xl" style={{ backgroundColor: COLORS.background }}>
                                            <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>{appointments.length}</p>
                                            <p className="text-xs text-gray-500">Appointments</p>
                                        </div>
                                        <div className="text-center p-3 rounded-xl" style={{ backgroundColor: COLORS.background }}>
                                            <p className="text-2xl font-bold" style={{ color: COLORS.primary }}>{wishlist.length}</p>
                                            <p className="text-xs text-gray-500">Saved Properties</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex flex-col gap-3">
                                    <Link href="/public/properties">
                                        <button
                                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white transition hover:opacity-90"
                                            style={{ backgroundColor: COLORS.primary }}
                                        >
                                            <HomeIcon className="w-5 h-5" /> Browse Properties
                                        </button>
                                    </Link>
                                    <button
                                        onClick={() => setActiveTab("appointments")}
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition hover:opacity-80"
                                        style={{ border: `1px solid ${COLORS.primary}`, color: COLORS.primary }}
                                    >
                                        <CalendarDaysIcon className="w-5 h-5" /> View My Appointments
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-white transition hover:opacity-90"
                                        style={{ backgroundColor: '#dc2626' }}
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5" /> Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}