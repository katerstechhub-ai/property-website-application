"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AppointmentsPage() {
    const router = useRouter();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            router.push("/public/login");
            return;
        }
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        const token = getToken();
        const userData = JSON.parse(localStorage.getItem("user"));
        const userId = userData?._id || userData?.id;

        try {
            const pubTokenRes = await fetch("http://property.reworkstaging.name.ng/v1/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: "d@g.com" })
            });
            const pubTokenData = await pubTokenRes.json();
            const publicToken = pubTokenData.token;

            const appointmentsRes = await fetch(`http://property.reworkstaging.name.ng/v1/appointments?user=${userId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const appointmentsData = await appointmentsRes.json();

            const appointmentsWithDetails = [];
            if (appointmentsData.data && appointmentsData.data.length > 0) {
                for (const apt of appointmentsData.data) {
                    const propRes = await fetch(`http://property.reworkstaging.name.ng/v1/properties/${apt.property_id}`, {
                        headers: { "Authorization": `Bearer ${publicToken}` }
                    });
                    const propData = await propRes.json();
                    appointmentsWithDetails.push({ ...apt, property: propData.data });
                }
            }
            setAppointments(appointmentsWithDetails);
        } catch (err) {
            console.error("Error fetching appointments:", err);
        } finally {
            setLoading(false);
        }
    };

    const confirmAppointment = async (appointmentId) => {
        const token = getToken();
        try {
            const res = await fetch(`http://property.reworkstaging.name.ng/v1/appointments/${appointmentId}/set-user-appointment-completion`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                fetchAppointments();
            }
        } catch (err) {
            console.error("Error confirming appointment:", err);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        const token = getToken();
        try {
            const res = await fetch(`http://property.reworkstaging.name.ng/v1/appointments/${appointmentId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                fetchAppointments();
            }
        } catch (err) {
            console.error("Error canceling appointment:", err);
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
            accepted: { bg: "bg-green-100", text: "text-green-800", label: "Accepted" },
            rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" },
            completed: { bg: "bg-blue-100", text: "text-blue-800", label: "Completed" }
        };
        const s = config[status?.toLowerCase()] || config.pending;
        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>{s.label}</span>;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href="/tenant" className="text-blue-600 hover:underline inline-flex items-center">
                    ← Back to Dashboard
                </Link>
            </div>

            <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
            <p className="text-gray-600 mb-8">Track and manage your property viewing appointments</p>

            {appointments.length === 0 ? (
                <div className="bg-gray-50 rounded-xl p-12 text-center">
                    <span className="text-6xl block mb-4">📅</span>
                    <h3 className="text-xl font-semibold mb-2">No Appointments Yet</h3>
                    <p className="text-gray-500 mb-4">Book appointments to view properties you're interested in</p>
                    <Link href="/public" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block">
                        Browse Properties
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {appointments.map((apt) => (
                        <div key={apt._id} className="bg-white border rounded-xl p-6 hover:shadow-lg transition">
                            <div className="flex flex-wrap justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                                        <h3 className="font-bold text-xl">{apt.property?.name || "Property"}</h3>
                                        {getStatusBadge(apt.status)}
                                    </div>

                                    <p className="text-gray-600 mb-3">{apt.property?.address}</p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Date</p>
                                            <p className="font-medium">{apt.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Time</p>
                                            <p className="font-medium">{apt.time?.from} - {apt.time?.to}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Property Type</p>
                                            <p className="font-medium">{apt.property?.type}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Price</p>
                                            <p className="font-medium">₦{apt.property?.price?.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {apt.msg && (
                                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                            <p className="text-sm text-gray-600">
                                                <span className="font-medium">Your Note:</span> {apt.msg}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 min-w-[120px]">
                                    <Link href={`/public/properties/${apt.property_id}`}>
                                        <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium">
                                            View Property
                                        </button>
                                    </Link>

                                    {apt.status?.toLowerCase() === "accepted" && (
                                        <button
                                            onClick={() => confirmAppointment(apt._id)}
                                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                                        >
                                            Confirm Completion
                                        </button>
                                    )}

                                    {apt.status?.toLowerCase() === "pending" && (
                                        <button
                                            onClick={() => cancelAppointment(apt._id)}
                                            className="w-full px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 text-sm font-medium"
                                        >
                                            Cancel Request
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}