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
} from "@heroicons/react/24/outline";

export default function AdminAppointments() {
    const router = useRouter();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) { router.push("/admin/login"); return; }
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        const token = getToken();
        try {
            const pubTokenRes = await fetch("http://property.reworkstaging.name.ng/v1/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: "d@g.com" })
            });
            const pubTokenData = await pubTokenRes.json();
            const publicToken = pubTokenData.token;

            const res = await fetch("http://property.reworkstaging.name.ng/v1/appointments", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();

            const appointmentsWithDetails = [];
            if (data.data && data.data.length > 0) {
                for (const apt of data.data) {
                    try {
                        const propRes = await fetch(`http://property.reworkstaging.name.ng/v1/properties/${apt.property_id}`, {
                            headers: { "Authorization": `Bearer ${publicToken}` }
                        });
                        const propData = await propRes.json();
                        appointmentsWithDetails.push({ ...apt, property: propData.data });
                    } catch {
                        appointmentsWithDetails.push(apt);
                    }
                }
            }
            setAppointments(appointmentsWithDetails);
        } catch (err) {
            console.error("Error fetching appointments:", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: ClockIcon, label: "Pending" },
            accepted: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircleIcon, label: "Accepted" },
            rejected: { bg: "bg-red-100", text: "text-red-700", icon: XCircleIcon, label: "Rejected" },
            completed: { bg: "bg-blue-100", text: "text-blue-700", icon: CheckCircleIcon, label: "Completed" }
        };
        const s = config[status?.toLowerCase()] || config.pending;
        const Icon = s.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                <Icon className="w-3 h-3" /> {s.label}
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
                            <p className="text-gray-500 text-sm mt-1">View all appointment requests across the platform</p>
                        </div>
                        <span className="bg-red-50 text-red-600 text-sm font-semibold px-4 py-2 rounded-xl">
                            {appointments.length} total
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {appointments.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                        <CalendarDaysIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Appointments Yet</h3>
                        <p className="text-gray-400">Appointments will appear here when users book property viewings.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left px-6 py-4 font-semibold text-sm text-gray-600">Property</th>
                                        <th className="text-left px-6 py-4 font-semibold text-sm text-gray-600">Date & Time</th>
                                        <th className="text-left px-6 py-4 font-semibold text-sm text-gray-600">User ID</th>
                                        <th className="text-left px-6 py-4 font-semibold text-sm text-gray-600">Status</th>
                                        <th className="text-left px-6 py-4 font-semibold text-sm text-gray-600">Note</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {appointments.map((apt) => (
                                        <tr key={apt._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900">{apt.property?.name || "Unknown"}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <MapPinIcon className="w-3 h-3" /> {apt.property?.city || "—"}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-700">{apt.date}</p>
                                                <p className="text-xs text-gray-500">{apt.time?.from} - {apt.time?.to}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                                                    {apt.user_id?.slice(-12)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">{getStatusBadge(apt.status)}</td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">{apt.msg || "—"}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}