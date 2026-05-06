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

const StatusBadge = ({ status }) => {
    const map = {
        pending:   { bg: '#fef3c7', text: '#92400e', label: 'Pending' },
        accepted:  { bg: '#d1fae5', text: '#065f46', label: 'Accepted' },
        rejected:  { bg: '#fee2e2', text: '#991b1b', label: 'Rejected' },
        completed: { bg: '#dbeafe', text: '#1e40af', label: 'Completed' },
    };
    const s = map[status?.toLowerCase()] || map.pending;
    return (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ backgroundColor: s.bg, color: s.text, fontFamily: "system-ui" }}>
            {s.label}
        </span>
    );
};

export default function AppointmentsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const showToast = (message, type) => setToast({ message, type });

    // Use whichever token has the most access
    const getUserToken = () => localStorage.getItem("token");
    const getPropertyToken = () => localStorage.getItem("admin_token") || localStorage.getItem("token");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) { router.push("/tenant/login"); return; }
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
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
            const res = await fetch(`${BASE}/appointments?user=${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const list = data.data || [];

            // Fetch property details for each appointment
            const enriched = await Promise.all(list.map(async (apt) => {
                if (!apt.property_id) return apt;
                try {
                    const pRes = await fetch(`${BASE}/properties/${apt.property_id}`, {
                        headers: { Authorization: `Bearer ${propToken}` }
                    });
                    const pData = await pRes.json();
                    const prop = pData.data || pData.property || (pData._id ? pData : null);
                    return { ...apt, property: prop, propertyImage: prop ? extractImageUrl(prop) : null };
                } catch {
                    return apt;
                }
            }));

            setAppointments(enriched);
        } catch (err) {
            console.error("Appointments error:", err);
            showToast("Failed to load appointments", "error");
        } finally {
            setLoading(false);
        }
    };

    const confirmCompletion = async (aptId) => {
        const token = getUserToken();
        try {
            const res = await fetch(`${BASE}/appointments/${aptId}/set-user-appointment-completion`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok || data.code === 200) {
                showToast("Appointment marked as complete!", "success");
                setAppointments(prev => prev.map(a => a._id === aptId ? { ...a, status: "completed" } : a));
            } else {
                showToast(data.message || "Failed to update", "error");
            }
        } catch { showToast("Network error", "error"); }
    };

    const cancelAppointment = async (aptId) => {
        if (!confirm("Cancel this appointment?")) return;
        const token = getUserToken();
        try {
            const res = await fetch(`${BASE}/appointments/${aptId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok || data.code === 200) {
                showToast("Appointment cancelled", "success");
                setAppointments(prev => prev.filter(a => a._id !== aptId));
            } else {
                showToast(data.message || "Failed to cancel", "error");
            }
        } catch { showToast("Network error", "error"); }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.background }}>
            <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: COLORS.primary }} />
        </div>
    );

    return (
        <div className="min-h-screen py-8" style={{ backgroundColor: COLORS.background }}>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="max-w-5xl mx-auto px-4">
                <div className="mb-6">
                    <Link href="/tenant" className="text-sm font-medium transition hover:opacity-70"
                        style={{ color: COLORS.primary, fontFamily: "system-ui" }}>← Back to Dashboard</Link>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: COLORS.textDark }}>My Appointments</h1>
                        <p className="text-sm mt-1" style={{ color: COLORS.textLight, fontFamily: "system-ui" }}>
                            Track your property viewing appointments
                        </p>
                    </div>
                    <button onClick={fetchAppointments}
                        className="text-xs px-3 py-2 rounded-lg border transition"
                        style={{ borderColor: COLORS.border, color: COLORS.primary, fontFamily: "system-ui" }}>
                        ↺ Refresh
                    </button>
                </div>

                {appointments.length === 0 ? (
                    <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
                        <span className="text-6xl block mb-4">📅</span>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.textDark }}>No Appointments Yet</h3>
                        <p className="mb-5 text-sm" style={{ color: COLORS.textLight, fontFamily: "system-ui" }}>
                            Book viewings from property listings
                        </p>
                        <Link href="/public/properties">
                            <button className="px-6 py-2.5 rounded-xl font-semibold text-white transition hover:opacity-90"
                                style={{ backgroundColor: COLORS.primary, fontFamily: "system-ui" }}>
                                Browse Properties
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((apt) => {
                            const prop = apt.property;
                            const price = parseInt(String(prop?.price || "0").replace(/,/g, ""));
                            return (
                                <div key={apt._id} className="rounded-2xl p-5 shadow-sm"
                                    style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
                                    <div className="flex flex-wrap gap-5 justify-between">
                                        {/* Left */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-4 flex-wrap">
                                                {apt.propertyImage ? (
                                                    <img src={apt.propertyImage} alt=""
                                                        className="w-14 h-14 rounded-xl object-cover shrink-0" />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 text-2xl"
                                                        style={{ backgroundColor: `${COLORS.primary}12` }}>🏠</div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold truncate" style={{ color: COLORS.textDark }}>
                                                        {prop?.name || "Property"}
                                                    </h3>
                                                    <p className="text-xs truncate" style={{ color: COLORS.textLight, fontFamily: "system-ui" }}>
                                                        {prop?.address || [prop?.city, prop?.state].filter(Boolean).join(", ")}
                                                    </p>
                                                </div>
                                                <StatusBadge status={apt.status} />
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                                                {[
                                                    ["Date", apt.date],
                                                    ["Time", apt.time ? `${apt.time.from} – ${apt.time.to}` : "—"],
                                                    ["Type", prop?.type],
                                                    ["Price", prop?.price ? `₦${isNaN(price) ? prop.price : price.toLocaleString()}` : "—"],
                                                ].map(([label, value]) => (
                                                    <div key={label} className="rounded-xl p-3" style={{ backgroundColor: COLORS.background }}>
                                                        <p className="text-xs mb-0.5" style={{ color: COLORS.textLight, fontFamily: "system-ui" }}>{label}</p>
                                                        <p className="font-semibold text-sm truncate" style={{ color: label === "Price" ? COLORS.primary : COLORS.textDark, fontFamily: "system-ui" }}>
                                                            {value || "—"}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            {apt.msg && (
                                                <div className="px-4 py-3 rounded-xl text-sm"
                                                    style={{ backgroundColor: `${COLORS.primary}10`, color: COLORS.primary, fontFamily: "system-ui" }}>
                                                    <span className="font-semibold">Note:</span> {apt.msg}
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-2 min-w-[140px]">
                                            <Link href={`/public/properties/${apt.property_id}`}>
                                                <button className="w-full px-4 py-2 rounded-xl text-sm font-medium transition"
                                                    style={{ border: `1px solid ${COLORS.primary}`, color: COLORS.primary, fontFamily: "system-ui" }}>
                                                    View Property
                                                </button>
                                            </Link>
                                            {apt.status?.toLowerCase() === "accepted" && (
                                                <button onClick={() => confirmCompletion(apt._id)}
                                                    className="w-full px-4 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                                                    style={{ backgroundColor: '#065f46', fontFamily: "system-ui" }}>
                                                    ✓ Mark Complete
                                                </button>
                                            )}
                                            {apt.status?.toLowerCase() === "pending" && (
                                                <button onClick={() => cancelAppointment(apt._id)}
                                                    className="w-full px-4 py-2 rounded-xl text-sm font-medium transition"
                                                    style={{ border: `1px solid #dc2626`, color: '#dc2626', fontFamily: "system-ui" }}>
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
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