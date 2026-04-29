"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    BuildingOfficeIcon,
    CalendarDaysIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    PlusCircleIcon,
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    MapPinIcon,
    EnvelopeIcon,
    PhoneIcon,
    BriefcaseIcon,
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
    ChartBarIcon,
    StarIcon,
    HomeIcon,
    CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

export default function AgentDashboard() {
    const router = useRouter();
    const [agent, setAgent] = useState(null);
    const [properties, setProperties] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [actionLoading, setActionLoading] = useState(null);

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            router.push("/agent/login");
            return;
        }
        const parsed = JSON.parse(userData);
        const role = parsed.role?.toLowerCase();
        if (role !== "agent") {
            router.push("/agent/login");
            return;
        }
        setAgent(parsed);
        fetchData(parsed);
    }, []);

    const fetchData = async (agentData) => {
        const token = getToken();
        const agentId = agentData?.id || agentData?._id;

        try {
            // Get public token for property lookups
            const pubTokenRes = await fetch("http://property.reworkstaging.name.ng/v1/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: "d@g.com" })
            });
            const pubTokenData = await pubTokenRes.json();
            const publicToken = pubTokenData.token;

            // Fetch agent's properties
            const propsRes = await fetch(`http://property.reworkstaging.name.ng/v1/properties?agent=${agentId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const propsData = await propsRes.json();
            setProperties(propsData.data || []);

            // Fetch appointments for agent's properties
            const aptRes = await fetch(`http://property.reworkstaging.name.ng/v1/appointments?agent=${agentId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const aptData = await aptRes.json();

            // Enrich appointments with property details
            const enriched = [];
            if (aptData.data && aptData.data.length > 0) {
                for (const apt of aptData.data) {
                    try {
                        const propRes = await fetch(`http://property.reworkstaging.name.ng/v1/properties/${apt.property_id}`, {
                            headers: { "Authorization": `Bearer ${publicToken}` }
                        });
                        const propData = await propRes.json();
                        enriched.push({ ...apt, property: propData.data });
                    } catch {
                        enriched.push(apt);
                    }
                }
            }
            setAppointments(enriched);
        } catch (err) {
            console.error("Error fetching agent data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAppointmentAction = async (aptId, action) => {
        const token = getToken();
        setActionLoading(aptId + action);
        try {
            const endpoint = action === "accept"
                ? `http://property.reworkstaging.name.ng/v1/appointments/${aptId}/set-agent-appointment-acceptance`
                : `http://property.reworkstaging.name.ng/v1/appointments/${aptId}`;
            const method = action === "accept" ? "PUT" : "DELETE";
            const res = await fetch(endpoint, {
                method,
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.code === 200) {
                if (action === "accept") {
                    setAppointments(prev => prev.map(a =>
                        a._id === aptId ? { ...a, status: "accepted" } : a
                    ));
                } else {
                    setAppointments(prev => prev.filter(a => a._id !== aptId));
                }
            }
        } catch (err) {
            console.error("Action error:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const deleteProperty = async (propertyId) => {
        if (!confirm("Delete this property? This cannot be undone.")) return;
        const token = getToken();
        try {
            const res = await fetch(`http://property.reworkstaging.name.ng/v1/properties/${propertyId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) setProperties(prev => prev.filter(p => p._id !== propertyId));
        } catch (err) {
            console.error("Error deleting property:", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/public");
    };

    const getStatusBadge = (status) => {
        const config = {
            pending:   { bg: "bg-amber-100",  text: "text-amber-700",  icon: ClockIcon,        label: "Pending" },
            accepted:  { bg: "bg-green-100",  text: "text-green-700",  icon: CheckCircleIcon,  label: "Accepted" },
            rejected:  { bg: "bg-red-100",    text: "text-red-700",    icon: XCircleIcon,      label: "Rejected" },
            completed: { bg: "bg-blue-100",   text: "text-blue-700",   icon: CheckCircleIcon,  label: "Completed" },
        };
        const s = config[status?.toLowerCase()] || config.pending;
        const Icon = s.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                <Icon className="w-3 h-3" />
                {s.label}
            </span>
        );
    };

    const tabs = [
        { id: "overview",      label: "Overview",      icon: ChartBarIcon },
        { id: "properties",    label: "My Properties", icon: BuildingOfficeIcon, count: properties.length },
        { id: "appointments",  label: "Appointments",  icon: CalendarDaysIcon,   count: appointments.filter(a => a.status?.toLowerCase() === "pending").length },
        { id: "profile",       label: "Profile",       icon: UserCircleIcon },
    ];

    const pendingCount = appointments.filter(a => a.status?.toLowerCase() === "pending").length;
    const verifiedCount = properties.filter(p => p.is_verified).length;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner */}
            <div className="relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1600')"
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/85 via-violet-800/75 to-purple-900/85" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border border-white/30 shadow-xl">
                                <BriefcaseIcon className="w-9 h-9 text-white" />
                            </div>
                            <div>
                                <p className="text-purple-200 text-sm">Welcome back,</p>
                                <h1 className="text-2xl font-bold text-white">
                                    {agent?.full_name || `${agent?.first_name || ""} ${agent?.last_name || ""}`.trim() || "Agent"}
                                </h1>
                                {agent?.company && (
                                    <p className="text-purple-200 text-sm flex items-center gap-1 mt-0.5">
                                        <BuildingOfficeIcon className="w-3.5 h-3.5" />
                                        {agent.company}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link href="/agent/properties/create">
                                <button className="flex items-center gap-2 bg-white text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-xl text-sm font-semibold transition shadow-md">
                                    <PlusCircleIcon className="w-4 h-4" />
                                    Add Property
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

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        {[
                            { icon: BuildingOfficeIcon, value: properties.length,  label: "Total Listings",    color: "text-purple-300" },
                            { icon: CheckCircleIcon,    value: verifiedCount,       label: "Verified",          color: "text-green-300"  },
                            { icon: CalendarDaysIcon,   value: appointments.length, label: "Appointments",      color: "text-blue-300"   },
                            { icon: ClockIcon,          value: pendingCount,        label: "Pending Reviews",   color: "text-amber-300"  },
                        ].map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/20 hover:bg-white/15 transition">
                                    <Icon className={`w-6 h-6 ${s.color} mx-auto mb-1`} />
                                    <p className="text-2xl font-bold text-white">{s.value}</p>
                                    <p className="text-purple-200 text-xs">{s.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                    <div className="flex overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition border-b-2 ${
                                        activeTab === tab.id
                                            ? "border-purple-600 text-purple-600 bg-purple-50"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Overview Tab ── */}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Recent Properties */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <BuildingOfficeIcon className="w-5 h-5 text-purple-600" />
                                    Recent Listings
                                </h2>
                                <button onClick={() => setActiveTab("properties")} className="text-purple-600 text-sm hover:underline">
                                    View all
                                </button>
                            </div>
                            {properties.length === 0 ? (
                                <div className="text-center py-8">
                                    <BuildingOfficeIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 mb-3">No listings yet</p>
                                    <Link href="/agent/properties/create" className="text-purple-600 text-sm hover:underline">
                                        Add your first property →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {properties.slice(0, 4).map((prop) => (
                                        <div key={prop._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                {prop.images?.[0] ? (
                                                    <img src={prop.images[0]} className="w-full h-full object-cover" alt={prop.name} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <HomeIcon className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm truncate">{prop.name}</p>
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <MapPinIcon className="w-3 h-3" /> {prop.city}, {prop.state}
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-purple-700 font-bold text-sm">₦{prop.price?.toLocaleString()}</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${prop.is_verified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                                                    {prop.is_verified ? "Verified" : "Pending"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pending Appointments */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <CalendarDaysIcon className="w-5 h-5 text-purple-600" />
                                    Pending Appointments
                                </h2>
                                <button onClick={() => setActiveTab("appointments")} className="text-purple-600 text-sm hover:underline">
                                    View all
                                </button>
                            </div>
                            {pendingCount === 0 ? (
                                <div className="text-center py-8">
                                    <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No pending appointments</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {appointments.filter(a => a.status?.toLowerCase() === "pending").slice(0, 4).map((apt) => (
                                        <div key={apt._id} className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                            <p className="font-semibold text-sm">{apt.property?.name || "Property"}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {apt.date} · {apt.time?.from} – {apt.time?.to}
                                            </p>
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    onClick={() => handleAppointmentAction(apt._id, "accept")}
                                                    disabled={actionLoading === apt._id + "accept"}
                                                    className="flex-1 text-xs bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-lg font-medium transition disabled:opacity-50"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleAppointmentAction(apt._id, "reject")}
                                                    disabled={actionLoading === apt._id + "reject"}
                                                    className="flex-1 text-xs border border-red-400 text-red-600 hover:bg-red-50 py-1.5 rounded-lg font-medium transition disabled:opacity-50"
                                                >
                                                    Decline
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ── Properties Tab ── */}
                {activeTab === "properties" && (
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">My Properties ({properties.length})</h2>
                            <Link href="/agent/properties/create">
                                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm">
                                    <PlusCircleIcon className="w-4 h-4" />
                                    Add New Property
                                </button>
                            </Link>
                        </div>

                        {properties.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                                <BuildingOfficeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Properties Yet</h3>
                                <p className="text-gray-500 mb-4">Start listing properties for potential tenants</p>
                                <Link href="/agent/properties/create">
                                    <button className="bg-purple-600 text-white px-6 py-2.5 rounded-xl hover:bg-purple-700 inline-block text-sm font-semibold transition">
                                        Add Your First Property
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {properties.map((prop) => (
                                    <div key={prop._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
                                        <div className="h-44 bg-gray-100 relative overflow-hidden">
                                            {prop.images?.[0] ? (
                                                <img
                                                    src={prop.images[0]}
                                                    alt={prop.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <HomeIcon className="w-12 h-12 text-gray-300" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3 flex gap-2">
                                                <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-lg font-medium">
                                                    {prop.type}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded-lg font-medium ${prop.is_verified ? "bg-green-500 text-white" : "bg-amber-400 text-white"}`}>
                                                    {prop.is_verified ? "✓ Verified" : "⏳ Pending"}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-base mb-1 line-clamp-1">{prop.name}</h3>
                                            <p className="text-gray-500 text-xs mb-2 flex items-center gap-1">
                                                <MapPinIcon className="w-3 h-3" /> {prop.city}, {prop.state}
                                            </p>
                                            <p className="text-purple-700 font-bold text-lg mb-3">₦{prop.price?.toLocaleString()}</p>
                                            <div className="flex gap-2">
                                                <Link href={`/public/properties/${prop._id}`} className="flex-1" target="_blank">
                                                    <button className="w-full flex items-center justify-center gap-1.5 border border-gray-300 text-gray-600 hover:bg-gray-50 py-2 rounded-xl text-xs font-medium transition">
                                                        <EyeIcon className="w-3.5 h-3.5" /> View
                                                    </button>
                                                </Link>
                                                <Link href={`/agent/properties/${prop._id}/edit`} className="flex-1">
                                                    <button className="w-full flex items-center justify-center gap-1.5 border border-purple-400 text-purple-600 hover:bg-purple-50 py-2 rounded-xl text-xs font-medium transition">
                                                        <PencilSquareIcon className="w-3.5 h-3.5" /> Edit
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => deleteProperty(prop._id)}
                                                    className="px-3 py-2 border border-red-300 text-red-500 hover:bg-red-50 rounded-xl text-xs transition"
                                                >
                                                    <TrashIcon className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Appointments Tab ── */}
                {activeTab === "appointments" && (
                    <div className="space-y-4">
                        {appointments.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                                <CalendarDaysIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Appointments Yet</h3>
                                <p className="text-gray-500">Appointment requests will appear here once tenants book viewings</p>
                            </div>
                        ) : (
                            appointments.map((apt) => (
                                <div key={apt._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex flex-wrap justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                                                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                                                    <BuildingOfficeIcon className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">{apt.property?.name || "Property"}</h3>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <MapPinIcon className="w-3 h-3" /> {apt.property?.address || apt.property?.city}
                                                    </p>
                                                </div>
                                                {getStatusBadge(apt.status)}
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <p className="text-xs text-gray-400 mb-0.5">Date</p>
                                                    <p className="font-semibold text-sm">{apt.date}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <p className="text-xs text-gray-400 mb-0.5">Time</p>
                                                    <p className="font-semibold text-sm">{apt.time?.from} – {apt.time?.to}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-xl p-3">
                                                    <p className="text-xs text-gray-400 mb-0.5">Tenant ID</p>
                                                    <p className="font-mono text-xs text-gray-600">{apt.user_id?.slice(-10)}</p>
                                                </div>
                                            </div>

                                            {apt.msg && (
                                                <div className="bg-purple-50 border border-purple-100 px-4 py-3 rounded-xl">
                                                    <p className="text-sm text-purple-700">
                                                        <span className="font-semibold">Message: </span>{apt.msg}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {apt.status?.toLowerCase() === "pending" && (
                                            <div className="flex flex-col gap-2 min-w-[140px]">
                                                <button
                                                    onClick={() => handleAppointmentAction(apt._id, "accept")}
                                                    disabled={actionLoading === apt._id + "accept"}
                                                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 shadow-sm"
                                                >
                                                    <CheckCircleIcon className="w-4 h-4" />
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleAppointmentAction(apt._id, "reject")}
                                                    disabled={actionLoading === apt._id + "reject"}
                                                    className="w-full flex items-center justify-center gap-2 border-2 border-red-400 text-red-600 hover:bg-red-50 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                                                >
                                                    <XCircleIcon className="w-4 h-4" />
                                                    Decline
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* ── Profile Tab ── */}
                {activeTab === "profile" && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-violet-700 p-6 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30">
                                        <BriefcaseIcon className="w-9 h-9 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            {agent?.full_name || `${agent?.first_name || ""} ${agent?.last_name || ""}`.trim()}
                                        </h2>
                                        <p className="text-purple-200 text-sm">Real Estate Agent</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                {[
                                    { icon: EnvelopeIcon,        label: "Email",   value: agent?.email },
                                    { icon: PhoneIcon,           label: "Phone",   value: agent?.phone || "Not provided" },
                                    { icon: BuildingOfficeIcon,  label: "Company", value: agent?.company || "Not provided" },
                                    { icon: CalendarDaysIcon,    label: "Member Since", value: agent?.createdAt ? new Date(agent.createdAt).toLocaleDateString() : "—" },
                                ].map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                            <Icon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500">{item.label}</p>
                                                <p className="font-medium">{item.value}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="pt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                        Logout
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