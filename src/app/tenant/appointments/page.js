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
    useEffect(() => {
        const t = setTimeout(onClose, 4000);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-gray-800 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[260px]">
                {type === "success" ? (
                    <svg className="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
                <span className="text-sm">{message}</span>
                <button onClick={onClose} className="ml-auto text-gray-400 hover:text-white">✕</button>
            </div>
        </div>
    );
}

const StatusBadge = ({ status }) => {
    const map = {
        pending:   { bg: '#fef3c7', text: '#92400e', label: 'Pending',   message: 'Waiting for agent approval' },
        accepted:  { bg: '#d1fae5', text: '#065f46', label: 'Accepted',  message: 'Agent approved! Confirm your visit.' },
        rejected:  { bg: '#fee2e2', text: '#991b1b', label: 'Rejected',  message: 'Agent declined this request' },
        completed: { bg: '#dbeafe', text: '#1e40af', label: 'Completed', message: 'Viewing completed' },
    };
    const s = map[status?.toLowerCase()] || map.pending;
    return (
        <div className="flex flex-col items-end gap-1">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ backgroundColor: s.bg, color: s.text }}>
                {s.label}
            </span>
            <span className="text-xs" style={{ color: COLORS.textLight }}>{s.message}</span>
        </div>
    );
};

export default function AppointmentsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const showToast = (message, type) => setToast({ message, type });
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

            const enriched = await Promise.all(list.map(async (apt) => {
                if (!apt.property_id) return { ...apt, property: null };
                try {
                    const pRes = await fetch(`${BASE}/properties/${apt.property_id}`, {
                        headers: { Authorization: `Bearer ${propToken}` }
                    });
                    const pData = await pRes.json();
                    return { ...apt, property: pData.data || null };
                } catch {
                    return { ...apt, property: null };
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
        } catch {
            showToast("Network error", "error");
        }
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
        } catch {
            showToast("Network error", "error");
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

            <div className="max-w-5xl mx-auto px-4">
                <div className="mb-6">
                    <Link href="/tenant" className="text-sm font-medium transition hover:opacity-70" style={{ color: COLORS.primary }}>
                        ← Back to Dashboard
                    </Link>
                </div>

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold" style={{ color: COLORS.textDark }}>My Appointments</h1>
                        <p className="text-sm mt-1" style={{ color: COLORS.textLight }}>
                            Track your property viewing appointments
                        </p>
                    </div>
                    <button
                        onClick={fetchAppointments}
                        className="text-xs px-3 py-2 rounded-lg border transition hover:opacity-80"
                        style={{ borderColor: COLORS.border, color: COLORS.primary }}
                    >
                        ↺ Refresh
                    </button>
                </div>

                {/* Approval Flow Info Box */}
                <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: `${COLORS.primary}10`, border: `1px solid ${COLORS.border}` }}>
                    <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: COLORS.primary }}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        How Appointment Approval Works
                    </h3>
                    <div className="grid grid-cols-3 gap-3 text-xs mt-2">
                        {[
                            { step: "1", bg: '#fef3c7', color: '#92400e', title: "You Book",        sub: "Request sent to agent" },
                            { step: "2", bg: '#d1fae5', color: '#065f46', title: "Agent Approves",  sub: "Agent accepts your request" },
                            { step: "3", bg: '#dbeafe', color: '#1e40af', title: "You Confirm",     sub: "Mark as completed" },
                        ].map(({ step, bg, color, title, sub }) => (
                            <div key={step} className="text-center">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1 font-bold"
                                    style={{ backgroundColor: bg, color }}>
                                    {step}
                                </div>
                                <p className="font-medium" style={{ color: COLORS.textDark }}>{title}</p>
                                <p className="text-gray-500">{sub}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs mt-3 text-center" style={{ color: COLORS.textLight }}>
                        ⚠️ Appointments must be approved by the agent before you can mark them as complete.
                        If status is "Pending", please wait for agent approval.
                    </p>
                </div>

                {appointments.length === 0 ? (
                    <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}>
                        <span className="text-6xl block mb-4">📅</span>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: COLORS.textDark }}>No Appointments Yet</h3>
                        <p className="mb-5 text-sm" style={{ color: COLORS.textLight }}>Book viewings from property listings</p>
                        <Link href="/public/properties">
                            <button className="px-6 py-2.5 rounded-xl font-semibold text-white transition hover:opacity-90"
                                style={{ backgroundColor: COLORS.primary }}>
                                Browse Properties
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((apt) => {
                            const prop = apt.property;
                            const rawPrice = String(prop?.price || "0").replace(/,/g, "");
                            const price = parseInt(rawPrice);
                            const status = apt.status?.toLowerCase();
                            const isPending = status === "pending";
                            const isAccepted = status === "accepted";

                            return (
                                <div
                                    key={apt._id}
                                    className="rounded-2xl p-5 shadow-sm"
                                    style={{ backgroundColor: COLORS.cardBg, border: `1px solid ${COLORS.border}` }}
                                >
                                    <div className="flex flex-wrap gap-4 justify-between">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold truncate" style={{ color: COLORS.textDark }}>
                                                        {prop?.name || "Property"}
                                                    </h3>
                                                    <p className="text-xs truncate" style={{ color: COLORS.textLight }}>
                                                        {prop?.address || [prop?.city, prop?.state].filter(Boolean).join(", ") || "—"}
                                                    </p>
                                                </div>
                                                <StatusBadge status={apt.status} />
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                                                {[
                                                    { label: "Date",    value: apt.date },
                                                    { label: "Time",    value: apt.time ? `${apt.time.from} – ${apt.time.to}` : "—" },
                                                    { label: "Type",    value: prop?.type },
                                                    { label: "Price",   value: prop?.price ? `₦${isNaN(price) ? prop.price : price.toLocaleString()}` : "—", isPrice: true },
                                                ].map(({ label, value, isPrice }) => (
                                                    <div key={label} className="rounded-xl p-2" style={{ backgroundColor: COLORS.background }}>
                                                        <p className="text-xs mb-0.5" style={{ color: COLORS.textLight }}>{label}</p>
                                                        <p className="font-semibold text-sm truncate"
                                                            style={{ color: isPrice ? COLORS.primary : COLORS.textDark }}>
                                                            {value || "—"}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            {apt.msg && (
                                                <div className="px-3 py-2 rounded-xl text-sm"
                                                    style={{ backgroundColor: `${COLORS.primary}10`, color: COLORS.primary }}>
                                                    <span className="font-semibold">Note:</span> {apt.msg}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2 min-w-[130px]">
                                            {isAccepted && (
                                                <button
                                                    onClick={() => confirmCompletion(apt._id)}
                                                    className="w-full px-3 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                                                    style={{ backgroundColor: '#065f46' }}
                                                >
                                                    ✓ Mark Complete
                                                </button>
                                            )}
                                            {isPending && (
                                                <button
                                                    onClick={() => cancelAppointment(apt._id)}
                                                    className="w-full px-3 py-2 rounded-xl text-sm font-medium transition hover:opacity-80"
                                                    style={{ border: "1px solid #dc2626", color: '#dc2626' }}
                                                >
                                                    Cancel Request
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