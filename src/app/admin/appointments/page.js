"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    CalendarDaysIcon,
    ArrowLeftIcon,
    MapPinIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    UserIcon,
} from "@heroicons/react/24/outline";

const BASE = "http://property.reworkstaging.name.ng/v1";

function Toast({ message, type, onClose }) {
    useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-gray-800 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[260px]">
                {type === "success" ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-400" />
                ) : (
                    <XCircleIcon className="w-5 h-5 text-red-400" />
                )}
                <span className="text-sm">{message}</span>
                <button onClick={onClose} className="ml-auto text-gray-400 hover:text-white">✕</button>
            </div>
        </div>
    );
}

export default function AdminAppointments() {
    const router = useRouter();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const showToast = (message, type) => setToast({ message, type });
    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) { router.push("/admin/login"); return; }
        fetchAppointments();
    }, []);

    const getPublicToken = async () => {
        try {
            const res = await fetch(`${BASE}/token`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: "d@g.com" })
            });
            const data = await res.json();
            return data.token;
        } catch (err) {
            console.error("Public token error:", err);
            return null;
        }
    };

    const fetchAppointments = async () => {
        setLoading(true);
        const token = getToken();
        
        if (!token) {
            showToast("No token found. Please login again.", "error");
            setLoading(false);
            return;
        }

        try {
            const publicToken = await getPublicToken();
            
            // Try to get appointments through merchant's agents
            // First, get all agents under this merchant
            const agentsRes = await fetch(`${BASE}/merchants/agents`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const agentsData = await agentsRes.json();
            const agents = agentsData.data || [];
            
            let allAppointments = [];
            
            // Fetch appointments for each agent
            for (const agent of agents) {
                const agentId = agent._id || agent.id;
                if (agentId) {
                    try {
                        const aptRes = await fetch(`${BASE}/appointments?agent=${agentId}`, {
                            headers: { "Authorization": `Bearer ${token}` }
                        });
                        const aptData = await aptRes.json();
                        const appointmentsList = aptData.data || [];
                        
                        // Fetch property details for each appointment
                        for (const apt of appointmentsList) {
                            if (apt.property_id) {
                                try {
                                    const propRes = await fetch(`${BASE}/properties/${apt.property_id}`, {
                                        headers: { "Authorization": `Bearer ${publicToken}` }
                                    });
                                    const propData = await propRes.json();
                                    allAppointments.push({ 
                                        ...apt, 
                                        property: propData.data || propData,
                                        agentName: agent.full_name || agent.name
                                    });
                                } catch {
                                    allAppointments.push({ ...apt, agentName: agent.full_name || agent.name });
                                }
                            } else {
                                allAppointments.push(apt);
                            }
                        }
                    } catch (err) {
                        console.error(`Error fetching appointments for agent ${agentId}:`, err);
                    }
                }
            }
            
            setAppointments(allAppointments);
        } catch (err) {
            console.error("Error fetching appointments:", err);
            showToast("Failed to load appointments", "error");
        } finally {
            setLoading(false);
        }
    };

    const acceptAppointment = async (appointmentId) => {
        if (!confirm("Accept this appointment?")) return;
        const token = getToken();

        try {
            const res = await fetch(`${BASE}/appointments/${appointmentId}/set-agent-appointment-acceptance`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();

            if (res.ok || data.code === 200) {
                showToast("Appointment accepted!", "success");
                fetchAppointments();
            } else {
                showToast(data.message || "Failed to accept", "error");
            }
        } catch (err) {
            showToast("Network error", "error");
        }
    };

    const rejectAppointment = async (appointmentId) => {
        if (!confirm("Reject this appointment?")) return;
        const token = getToken();

        try {
            const res = await fetch(`${BASE}/appointments/${appointmentId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();

            if (res.ok || data.code === 200) {
                showToast("Appointment rejected!", "success");
                fetchAppointments();
            } else {
                showToast(data.message || "Failed to reject", "error");
            }
        } catch (err) {
            showToast("Network error", "error");
        }
    };

    const completeAppointment = async (appointmentId) => {
        if (!confirm("Mark as completed?")) return;
        const token = getToken();

        try {
            const res = await fetch(`${BASE}/appointments/${appointmentId}/set-agent-appointment-completion`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();

            if (res.ok || data.code === 200) {
                showToast("Appointment completed!", "success");
                fetchAppointments();
            } else {
                showToast(data.message || "Failed to complete", "error");
            }
        } catch (err) {
            showToast("Network error", "error");
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Pending" },
            accepted: { bg: "bg-green-100", text: "text-green-700", label: "Accepted" },
            completed: { bg: "bg-blue-100", text: "text-blue-700", label: "Completed" }
        };
        const s = config[status?.toLowerCase()] || config.pending;
        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                {s.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <Link href="/admin" className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-sm font-medium mb-4">
                        <ArrowLeftIcon className="w-4 h-4" /> Back to Dashboard
                    </Link>
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <CalendarDaysIcon className="w-6 h-6 text-red-600" /> All Appointments
                            </h1>
                            <p className="text-gray-500 text-sm mt-1">Manage appointment requests</p>
                        </div>
                        <button
                            onClick={fetchAppointments}
                            className="flex items-center gap-2 border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-xl text-sm font-medium transition"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {appointments.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                        <CalendarDaysIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Appointments Yet</h3>
                        <p className="text-gray-400">Appointments will appear here when tenants book viewings.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {appointments.map((apt) => {
                            const status = apt.status?.toLowerCase();
                            const isPending = status === "pending";
                            const isAccepted = status === "accepted";
                            const property = apt.property;
                            const price = property?.price ? parseInt(String(property.price).replace(/,/g, "")) : 0;

                            return (
                                <div key={apt._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
                                    <div className="flex flex-wrap justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                                    <CalendarDaysIcon className="w-5 h-5 text-red-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{property?.name || "Unknown Property"}</h3>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <UserIcon className="w-3 h-3" /> User ID: {apt.user_id?.slice(-12) || "—"}
                                                    </p>
                                                    {apt.agentName && (
                                                        <p className="text-xs text-gray-400">Agent: {apt.agentName}</p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500 mb-1">Date</p>
                                                    <p className="font-medium text-sm text-gray-800">{apt.date || "—"}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500 mb-1">Time</p>
                                                    <p className="font-medium text-sm text-gray-800">{apt.time?.from} - {apt.time?.to}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500 mb-1">Property Type</p>
                                                    <p className="font-medium text-sm text-gray-800">{property?.type || "—"}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500 mb-1">Price</p>
                                                    <p className="font-medium text-sm text-red-600 font-semibold">
                                                        ₦{price ? price.toLocaleString() : (property?.price || "—")}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-3 mb-3 text-xs">
                                                {property?.bedroom > 0 && <span className="text-gray-600">🛏 {property.bedroom} beds</span>}
                                                {property?.bathroom > 0 && <span className="text-gray-600">🚿 {property.bathroom} baths</span>}
                                                {property?.parking_space > 0 && <span className="text-gray-600">🅿 {property.parking_space}</span>}
                                                {property?.total_area && <span className="text-gray-600">📐 {property.total_area}</span>}
                                            </div>

                                            {apt.msg && (
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-semibold">Message:</span> {apt.msg}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2 min-w-[140px]">
                                            {isPending && (
                                                <>
                                                    <button
                                                        onClick={() => acceptAppointment(apt._id)}
                                                        className="w-full px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-medium transition"
                                                    >
                                                        Accept
                                                    </button>
                                                    <button
                                                        onClick={() => rejectAppointment(apt._id)}
                                                        className="w-full px-4 py-2 border border-red-500 text-red-500 rounded-xl hover:bg-red-50 text-sm font-medium transition"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}

                                            {isAccepted && (
                                                <button
                                                    onClick={() => completeAppointment(apt._id)}
                                                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium transition"
                                                >
                                                    Mark Complete
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        {getStatusBadge(apt.status)}
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