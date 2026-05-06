"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    FiSearch, FiMapPin, FiHome, FiHeart,
    FiCheckCircle, FiStar, FiGrid, FiMaximize, FiTrendingUp, FiAward, FiUsers, FiShield
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

const BASE = "http://property.reworkstaging.name.ng/v1";

// Color Palette from your image
const COLORS = {
    primary: '#6E473B',
    secondary: '#BE85A9',
    background: '#F5F0ED',
    cardBg: '#FFFFFF',
    textLight: '#A7807B',
    textDark: '#291COE',
    border: '#E1D4C2',
    accent: '#6E473B'
};

// Retro text styles
const retroText = {
    heroHeading: "font-black uppercase tracking-tighter",
    heroSub: "font-black uppercase tracking-wide",
    sectionTitle: "font-black uppercase tracking-wide",
    badge: "font-bold uppercase tracking-wider text-xs",
    button: "font-black uppercase tracking-wide text-sm"
};

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

function PropertyCard({ property, wishlistIds, onWishlist }) {
    const img = extractImageUrl(property);
    const id = property._id || property.id;
    const price = parseInt(String(property.price || "0").replace(/,/g, ""));
    const inWishlist = wishlistIds.includes(id);

    return (
        <div className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
            <div className="relative h-52 overflow-hidden" style={{ backgroundColor: `${COLORS.primary}10` }}>
                {img ? (
                    <img src={img} alt={property.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <FiHome className="w-16 h-16" style={{ color: COLORS.textLight }} />
                    </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`${retroText.badge} text-xs font-bold px-2.5 py-1 rounded-lg text-white`} style={{ backgroundColor: COLORS.primary }}>
                        {property.type}
                    </span>
                    {property.is_verified && (
                        <span className={`${retroText.badge} text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1`} style={{ backgroundColor: COLORS.cardBg, color: COLORS.primary }}>
                            <FiCheckCircle className="w-3 h-3" /> VERIFIED
                        </span>
                    )}
                </div>
                <button
                    onClick={(e) => { e.preventDefault(); onWishlist(id); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition shadow"
                    style={{ backgroundColor: COLORS.cardBg }}
                >
                    {inWishlist ? <FaHeart className="w-4 h-4" style={{ color: COLORS.secondary }} /> : <FiHeart className="w-4 h-4" style={{ color: COLORS.textLight }} />}
                </button>
            </div>
            <Link href={`/public/properties/${id}`}>
                <div className="p-4 cursor-pointer">
                    <h3 className="font-bold text-base mb-1 line-clamp-1 transition" style={{ color: COLORS.textDark }}>{property.name}</h3>
                    <p className="text-xs flex items-center gap-1 mb-3" style={{ color: COLORS.textLight }}>
                        <FiMapPin className="w-3 h-3 shrink-0" />
                        {[property.city, property.state].filter(Boolean).join(", ")}
                    </p>
                    <p className="font-bold text-xl mb-3" style={{ color: COLORS.primary }}>
                        ₦{isNaN(price) ? property.price : price.toLocaleString()}
                        {property.type === "RENT" && <span className="text-xs font-normal ml-1" style={{ color: COLORS.textLight }}>/{property.payment_plan?.replace("PER_", "").toLowerCase() || "yr"}</span>}
                    </p>
                    <div className="flex items-center gap-3 text-xs pt-3" style={{ color: COLORS.textLight, borderTop: `1px solid ${COLORS.border}` }}>
                        {property.bedroom > 0 && <span>{property.bedroom} Beds</span>}
                        {property.bathroom > 0 && <span> {property.bathroom} Baths</span>}
                        {property.total_area && <span className="ml-auto font-medium">{property.total_area}</span>}
                    </div>
                </div>
            </Link>
        </div>
    );
}

export default function PropertiesPage() {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeFilter, setActiveFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [wishlistIds, setWishlistIds] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const raw = localStorage.getItem("user");
        if (raw) { try { setUser(JSON.parse(raw)); } catch { } }
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        setLoading(true);
        setError("");
        try {
            const merchantToken = localStorage.getItem("admin_token") || localStorage.getItem("token");
            const headers = merchantToken ? { Authorization: `Bearer ${merchantToken}` } : {};

            const safeFetch = async (url) => {
                try {
                    const res = await fetch(url, { headers });
                    if (!res.ok) return [];
                    const data = await res.json();
                    return data.data || data.properties || data.results || [];
                } catch { return []; }
            };

            let allProperties = [];
            const direct = await safeFetch(`${BASE}/properties?limit=100`);
            allProperties.push(...direct);

            if (allProperties.length === 0) {
                const cachedAgents = (() => {
                    try { return JSON.parse(localStorage.getItem("cached_agents") || "[]"); } catch { return []; }
                })();

                if (cachedAgents.length > 0) {
                    const results = await Promise.all(
                        cachedAgents.map(a => {
                            const aid = a._id || a.id;
                            return aid ? safeFetch(`${BASE}/properties?agent=${aid}&limit=100`) : Promise.resolve([]);
                        })
                    );
                    results.flat().forEach(p => allProperties.push(p));
                }
            }

            const deletedIds = JSON.parse(localStorage.getItem("deleted_properties") || "[]");
            const final = allProperties.filter(p => !deletedIds.includes(p._id || p.id));
            setProperties(final);

            const userData = localStorage.getItem("user");
            if (userData && merchantToken) {
                try {
                    const u = JSON.parse(userData);
                    const userId = u._id || u.id;
                    const wRes = await fetch(`${BASE}/users/${userId}/wishlist`, {
                        headers: { Authorization: `Bearer ${merchantToken}` }
                    });
                    const wData = await wRes.json();
                    setWishlistIds((wData.data || []).map(w => w.property_id || w._id || w.id));
                } catch { }
            }
        } catch (err) {
            setError("Failed to load properties. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleWishlist = async (propertyId) => {
        if (!user) { window.location.href = "/tenant/login"; return; }
        const token = localStorage.getItem("token");
        const userId = user._id || user.id;
        if (wishlistIds.includes(propertyId)) {
            setWishlistIds(prev => prev.filter(id => id !== propertyId));
        } else {
            setWishlistIds(prev => [...prev, propertyId]);
            try {
                await fetch(`${BASE}/users/wishlist`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ property_id: propertyId, user_id: userId })
                });
            } catch { }
        }
    };

    const filters = ["ALL", "RENT", "SALES", "LEASE"];
    const cities = ["All Cities", ...new Set(properties.map(p => p.city).filter(Boolean))];

    const filtered = properties
        .filter(p => {
            const matchType = activeFilter === "ALL" || p.type === activeFilter;
            const matchSearch = !searchQuery ||
                p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.address?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchCity = !selectedCity || selectedCity === "All Cities" || p.city === selectedCity;
            return matchType && matchSearch && matchCity;
        })
        .sort((a, b) => {
            if (sortBy === "price_asc") return parseInt(String(a.price || "0").replace(/,/g, "")) - parseInt(String(b.price || "0").replace(/,/g, ""));
            if (sortBy === "price_desc") return parseInt(String(b.price || "0").replace(/,/g, "")) - parseInt(String(a.price || "0").replace(/,/g, ""));
            return 0;
        });

    // Bottom section - will show always (even when no properties)
    const bottomSection = (
        <div className="mt-20">
            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-4 mb-12">
                <div className="h-px flex-1" style={{ backgroundColor: COLORS.border }}></div>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.primary }}></div>
                <div className="h-px flex-1" style={{ backgroundColor: COLORS.border }}></div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                <div className="text-center p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.primary}10` }}>
                        <FiShield className="w-7 h-7" style={{ color: COLORS.primary }} />
                    </div>
                    <h3 className={`${retroText.sectionTitle} text-sm mb-2`} style={{ color: COLORS.textDark }}>100% VERIFIED</h3>
                    <p className="text-xs" style={{ color: COLORS.textLight }}>All properties thoroughly vetted</p>
                </div>
                <div className="text-center p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.primary}10` }}>
                        <FiUsers className="w-7 h-7" style={{ color: COLORS.primary }} />
                    </div>
                    <h3 className={`${retroText.sectionTitle} text-sm mb-2`} style={{ color: COLORS.textDark }}>TRUSTED AGENTS</h3>
                    <p className="text-xs" style={{ color: COLORS.textLight }}>Licensed real estate professionals</p>
                </div>
                <div className="text-center p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.primary}10` }}>
                        <FiTrendingUp className="w-7 h-7" style={{ color: COLORS.primary }} />
                    </div>
                    <h3 className={`${retroText.sectionTitle} text-sm mb-2`} style={{ color: COLORS.textDark }}>BEST PRICES</h3>
                    <p className="text-xs" style={{ color: COLORS.textLight }}>Competitive market rates guaranteed</p>
                </div>
                <div className="text-center p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${COLORS.primary}10` }}>
                        <FiAward className="w-7 h-7" style={{ color: COLORS.primary }} />
                    </div>
                    <h3 className={`${retroText.sectionTitle} text-sm mb-2`} style={{ color: COLORS.textDark }}>24/7 SUPPORT</h3>
                    <p className="text-xs" style={{ color: COLORS.textLight }}>Always here to help you</p>
                </div>
            </div>

            {/* CTA Banner */}
            <div className="relative rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}>
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${COLORS.textDark}dd, ${COLORS.primary}cc)` }}></div>
                </div>
                <div className="relative p-12 text-center">
                    <h2 className={`${retroText.sectionTitle} text-2xl md:text-3xl text-white mb-4`}>READY TO FIND YOUR DREAM HOME?</h2>
                    <p className="text-white/90 mb-6 max-w-xl mx-auto">Join thousands of happy homeowners who found their perfect property with us</p>
                    <Link href="/tenant/register">
                        <button className={`${retroText.button} px-8 py-3 rounded-xl font-semibold transition shadow-lg inline-flex items-center gap-2 hover:scale-105`} style={{ backgroundColor: COLORS.cardBg, color: COLORS.primary }}>
                            GET STARTED <FiTrendingUp className="w-4 h-4" />
                        </button>
                    </Link>
                </div>
            </div>

            {/* Newsletter Section */}
            <div className="mt-16 text-center">
                <div className="max-w-2xl mx-auto">
                    <h3 className={`${retroText.sectionTitle} text-xl mb-2`} style={{ color: COLORS.textDark }}>STAY UPDATED</h3>
                    <p className="text-sm mb-6" style={{ color: COLORS.textLight }}>Get the latest property listings and market news directly in your inbox</p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input type="email" placeholder="Enter your email address" className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm" style={{ borderColor: COLORS.border, backgroundColor: COLORS.cardBg, color: COLORS.textDark }} />
                        <button className={`${retroText.button} px-6 py-3 rounded-xl font-semibold transition hover:opacity-80`} style={{ backgroundColor: COLORS.primary, color: '#fff' }}>
                            SUBSCRIBE
                        </button>
                    </div>
                    <p className="text-xs mt-4" style={{ color: COLORS.textLight }}>We respect your privacy. Unsubscribe at any time.</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen" style={{ backgroundColor: COLORS.background }}>
            {/* Hero Section - Darker overlay for better contrast */}
            <div className="relative h-[400px] bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}>
                {/* Darker overlay for better text visibility */}
                <div className="absolute inset-0" style={{
                    background: `linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.75) 100%)`,
                }} />

                <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                    <span className={`${retroText.badge} text-sm font-semibold tracking-widest uppercase mb-3`} style={{ color: COLORS.secondary }}>
                        BROWSE LISTINGS
                    </span>
                    <h1 className={`${retroText.heroHeading} text-4xl md:text-6xl text-white mb-4`} style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                        FIND YOUR PERFECT PROPERTY
                    </h1>
                    <p className="text-lg max-w-2xl text-white/90" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                        Explore verified listings across Nigeria from trusted agents and developers
                    </p>

                    {/* Search Bar - Icon beside text */}
                    <div className="mt-6 w-full max-w-lg">
                        <div className="flex gap-2 p-1.5 rounded-full" style={{ backgroundColor: `${COLORS.cardBg}dd` }}>
                            <input
                                type="text"
                                placeholder="Search by city, property type or name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 px-5 py-2.5 bg-transparent rounded-full focus:outline-none text-sm"
                                style={{ color: COLORS.textDark }}
                            />
                            <button className={`${retroText.button} px-5 py-2.5 rounded-full font-semibold text-white transition hover:opacity-90 flex items-center gap-2 text-sm`} style={{ backgroundColor: COLORS.primary }}>
                                <FiSearch className="w-4 h-4" /> SEARCH
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search + Filter Bar */}
                <div className="rounded-2xl shadow-md p-4 mb-6 -mt-8 relative z-10" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="flex-1 relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: COLORS.textLight }} />
                            <input
                                type="text"
                                placeholder="Search by name, city or address..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 text-sm"
                                style={{ border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.cardBg, color: COLORS.textDark }}
                            />
                        </div>
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 text-sm min-w-[140px]"
                            style={{ border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.cardBg, color: COLORS.textDark }}
                        >
                            {cities.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 text-sm min-w-[160px]"
                            style={{ border: `1px solid ${COLORS.border}`, backgroundColor: COLORS.cardBg, color: COLORS.textDark }}
                        >
                            <option value="latest">Sort: Latest</option>
                            <option value="price_asc">Price: Low → High</option>
                            <option value="price_desc">Price: High → Low</option>
                        </select>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-2 flex-wrap">
                        {filters.map(f => (
                            <button key={f} onClick={() => setActiveFilter(f)}
                                className={`${retroText.button} px-5 py-2 rounded-xl text-sm font-semibold transition ${activeFilter === f ? "text-white shadow-md" : "border"}`}
                                style={activeFilter === f ? { backgroundColor: COLORS.primary, color: '#fff' } : { backgroundColor: COLORS.cardBg, color: COLORS.textLight, borderColor: COLORS.border }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <p className="text-sm hidden md:block" style={{ color: COLORS.textLight }}>
                        <span className="font-semibold" style={{ color: COLORS.textDark }}>{filtered.length}</span> properties found
                    </p>
                </div>

                {error && (
                    <div className="mb-6 px-4 py-3 rounded-xl text-sm flex items-center justify-between" style={{ backgroundColor: `${COLORS.secondary}15`, border: `1px solid ${COLORS.secondary}`, color: COLORS.primary }}>
                        {error}
                        <button onClick={fetchProperties} className="underline ml-4 text-xs shrink-0">Retry</button>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="rounded-2xl overflow-hidden shadow-sm border animate-pulse" style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }}>
                                <div className="h-52" style={{ backgroundColor: `${COLORS.primary}10` }} />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 rounded w-3/4" style={{ backgroundColor: `${COLORS.primary}10` }} />
                                    <div className="h-3 rounded w-1/2" style={{ backgroundColor: `${COLORS.primary}5` }} />
                                    <div className="h-5 rounded w-1/3" style={{ backgroundColor: `${COLORS.primary}10` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <>
                        <div className="text-center py-20 rounded-2xl border" style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.border }}>
                            <FiHome className="w-20 h-20 mx-auto mb-4" style={{ color: COLORS.textLight }} />
                            <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.textDark }}>No properties found</h3>
                            <p className="text-sm mb-4" style={{ color: COLORS.textLight }}>Try adjusting your search or filters</p>
                            <button
                                onClick={() => { setSearchQuery(""); setSelectedCity(""); setActiveFilter("ALL"); }}
                                className={`${retroText.button} text-sm hover:underline font-medium`}
                                style={{ color: COLORS.primary }}
                            >
                                CLEAR ALL FILTERS
                            </button>
                        </div>
                        {/* Bottom section shows even when no properties */}
                        {bottomSection}
                    </>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map(p => (
                                <PropertyCard
                                    key={p._id || p.id}
                                    property={p}
                                    wishlistIds={wishlistIds}
                                    onWishlist={handleWishlist}
                                />
                            ))}
                        </div>
                        {bottomSection}
                    </>
                )}
            </div>
        </div>
    );
}