"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BASE = "http://property.reworkstaging.name.ng/v1";

const COLORS = {
    primary: '#6E473B',
    secondary: '#BE85A9',
    background: '#F5F0ED',
    cardBg: '#FFFFFF',
    textLight: '#A7807B',
    textDark: '#3D2B1F',
    border: '#E1D4C2'
};

function Toast({ message, type, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-gray-800 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[260px]">
                {type === "success"
                    ? <svg className="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    : <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                }
                <span className="text-sm" style={{ fontFamily: "system-ui" }}>{message}</span>
                <button onClick={onClose} className="ml-auto text-gray-400 hover:text-white">✕</button>
            </div>
        </div>
    );
}

function extractImageUrl(prop) {
    if (!prop) return null;
    const ok = (v) => typeof v === "string" && v.length > 4 &&
        (v.startsWith("http") || v.startsWith("/") || /\.(jpg|jpeg|png|webp|gif|svg)/i.test(v));
    const fromItem = (item) => {
        if (!item) return null;
        if (ok(item)) return item;
        if (typeof item === "object")
            for (const k of ["url", "uri", "path", "src", "image", "link", "file", "resource", "secure_url"])
                if (ok(item[k])) return item[k];
        return null;
    };
    const fromArr = (arr) => {
        if (!Array.isArray(arr) || !arr.length) return null;
        for (const item of arr) { const u = fromItem(item); if (u) return u; }
        return null;
    };
    return fromArr(prop.resources) || fromArr(prop.images) || fromArr(prop.media) ||
        fromArr(prop.photos) || fromArr(prop.files) ||
        fromItem(prop.image) || fromItem(prop.thumbnail) || null;
}

export default function WishlistPage() {
    const router = useRouter();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const showToast = (message, type) => setToast({ message, type });
    const getUserToken = () => localStorage.getItem("token");
    const getPropertyToken = () => localStorage.getItem("admin_token") || localStorage.getItem("token");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) { router.push("/tenant/login"); return; }
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        setLoading(true);
        const token = getUserToken();
        const propToken = getPropertyToken();
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = userData?._id || userData?.id;

        if (!token || !userId) {
            showToast("Please login again", "error");
            setLoading(false);
            router.push("/tenant/login");
            return;
        }

        try {
            const res = await fetch(`${BASE}/users/${userId}/wishlist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const items = data.data || [];

            // Fetch each property's details
            const properties = await Promise.all(items.map(async (item) => {
                const propId = item.property_id || item._id;
                if (!propId) return null;
                try {
                    const pRes = await fetch(`${BASE}/properties/${propId}`, {
                        headers: { Authorization: `Bearer ${propToken}` }
                    });
                    const pData = await pRes.json();
                    const prop = pData.data || pData.property || (pData._id ? pData : null);
                    if (!prop) return null;
                    return { ...prop, wishlist_item_id: item._id, imageUrl: extractImageUrl(prop) };
                } catch { return null; }
            }));

            setWishlist(properties.filter(Boolean));
        } catch (err) {
            console.error("Wishlist error:", err);
            showToast("Failed to load wishlist", "error");
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (propertyId) => {
        const token = getUserToken();
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = userData?._id || userData?.id;

        // Optimistically remove
        setWishlist(prev => prev.filter(p => (p._id || p.id) !== propertyId));

        try {
            // API: DELETE /users/:user_id/wishlist/:property_id
            const res = await fetch(`${BASE}/users/${userId}/wishlist/${propertyId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok || data.code === 200) {
                showToast("Removed from wishlist", "success");
            } else {
                showToast(data.message || "Failed to remove", "error");
                fetchWishlist(); // revert
            }
        } catch {
            showToast("Network error", "error");
            fetchWishlist();
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.background }}>
            <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: COLORS.primary }} />
        </div>
    );

    return (
        <div className="min-h-screen py-8" style={{ backgroundColor: COLORS.background }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-6">
                    <Link href="/tenant" className="text-sm font-medium transition hover:opacity-70"
                        style={{ color: COLORS.primary, fontFamily: "system-ui" }}>← Back to Dashboard</Link>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: COLORS.textDark }}>My Wishlist</h1>
                        <p className="text-sm mt-1" style={{ color: COLORS.textLight, fontFamily: "system-ui" }}>
                            {wishlist.length} saved {wishlist.length === 1 ? "property" : "properties"}
                        </p>
                    </div>
                    <button onClick={fetchWishlist}
                        className="text-xs px-3 py-2 rounded-lg border transition"
                        style={{ borderColor: COLORS.border, color: COLORS.primary, fontFamily: "system-ui" }}>
                        ↺ Refresh
                    </button>
                </div>

                {wishlist.length === 0 ? (
                    <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
                        <span className="text-6xl block mb-4">❤️</span>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.textDark }}>Your wishlist is empty</h3>
                        <p className="mb-5 text-sm" style={{ color: COLORS.textLight, fontFamily: "system-ui" }}>
                            Save properties you love while browsing
                        </p>
                        <Link href="/public/properties">
                            <button className="px-6 py-2.5 rounded-xl font-semibold text-white transition hover:opacity-90"
                                style={{ backgroundColor: COLORS.primary, fontFamily: "system-ui" }}>
                                Browse Properties
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {wishlist.map((property) => {
                            const propId = property._id || property.id;
                            const price = parseInt(String(property.price || "0").replace(/,/g, ""));
                            return (
                                <div key={propId} className="rounded-2xl overflow-hidden shadow-sm transition hover:shadow-md"
                                    style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden" style={{ backgroundColor: `${COLORS.primary}12` }}>
                                        {property.imageUrl ? (
                                            <img src={property.imageUrl} alt={property.name}
                                                className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-5xl">🏠</div>
                                        )}
                                        {/* Remove button */}
                                        <button onClick={() => removeFromWishlist(propId)}
                                            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center transition hover:scale-110"
                                            title="Remove from wishlist">
                                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        {/* Type badge */}
                                        {property.type && (
                                            <span className="absolute top-3 left-3 text-xs font-semibold text-white px-2.5 py-1 rounded-lg"
                                                style={{ backgroundColor: COLORS.primary, fontFamily: "system-ui" }}>
                                                {property.type}
                                            </span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <h3 className="font-bold text-base mb-1 line-clamp-1" style={{ color: COLORS.textDark }}>{property.name}</h3>
                                        <p className="text-sm mb-2 flex items-center gap-1" style={{ color: COLORS.textLight, fontFamily: "system-ui" }}>
                                            📍 {[property.city, property.state].filter(Boolean).join(", ") || "—"}
                                        </p>
                                        <p className="font-bold text-xl mb-3" style={{ color: COLORS.primary }}>
                                            ₦{isNaN(price) ? property.price : price.toLocaleString()}
                                        </p>

                                        {/* Room stats */}
                                        {[property.bedroom, property.bathroom].some(v => v != null) && (
                                            <div className="flex gap-3 text-xs mb-4 pb-3" style={{ color: COLORS.textLight, borderBottom: `1px solid ${COLORS.border}`, fontFamily: "system-ui" }}>
                                                {property.bedroom != null && <span>🛏 {property.bedroom} bed</span>}
                                                {property.bathroom != null && <span>🚿 {property.bathroom} bath</span>}
                                                {property.total_area && <span>📐 {property.total_area}</span>}
                                            </div>
                                        )}

                                        <Link href={`/public/properties/${propId}`}>
                                            <button className="w-full py-2.5 rounded-xl font-semibold text-white text-sm transition hover:opacity-90"
                                                style={{ backgroundColor: COLORS.primary, fontFamily: "system-ui" }}>
                                                View Details
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}