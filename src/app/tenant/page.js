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
} from "@heroicons/react/24/outline";

export default function TenantDashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            router.push("/tenant/login");
            return;
        }
        const parsed = JSON.parse(userData);

        // Role guard — block MERCHANT (admin) from accessing tenant dashboard
        if (parsed.role === "MERCHANT") {
            router.push("/tenant/login");
            return;
        }

        setUser(parsed);
        fetchData(parsed);
    }, []);

    const fetchData = async (userData) => {
        const token = getToken();
        const userId = userData?.id || userData?._id;

        try {
            const pubTokenRes = await fetch("http://property.reworkstaging.name.ng/v1/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: "d@g.com" })
            });
            const pubTokenData = await pubTokenRes.json();
            const publicToken = pubTokenData.token;

            const aptRes = await fetch(`http://property.reworkstaging.name.ng/v1/appointments?user=${userId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const aptData = await aptRes.json();

            const appointmentsWithDetails = [];
            if (aptData.data && aptData.data.length > 0) {
                for (const apt of aptData.data) {
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

            const wishlistRes = await fetch(`http://property.reworkstaging.name.ng/v1/users/${userId}/wishlist`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const wishlistData = await wishlistRes.json();

            const wishlistProperties = [];
            if (wishlistData.data && wishlistData.data.length > 0) {
                for (const item of wishlistData.data) {
                    try {
                        const propRes = await fetch(`http://property.reworkstaging.name.ng/v1/properties/${item.property_id}`, {
                            headers: { "Authorization": `Bearer ${publicToken}` }
                        });
                        const propData = await propRes.json();
                        if (propData.data) wishlistProperties.push({ ...propData.data, wishlist_id: item._id });
                    } catch {
                        // skip
                    }
                }
            }
            setWishlist(wishlistProperties);
        } catch (err) {
            console.error("Error fetching tenant data:", err);
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
            const data = await res.json();
            if (data.code === 200) {
                setAppointments(prev => prev.map(apt =>
                    apt._id === appointmentId ? { ...apt, status: "completed" } : apt
                ));
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
            const data = await res.json();
            if (data.code === 200) {
                setAppointments(prev => prev.filter(apt => apt._id !== appointmentId));
            }
        } catch (err) {
            console.error("Error canceling appointment:", err);
        }
    };

    const removeFromWishlist = async (propertyId) => {
        const token = getToken();
        const userData = JSON.parse(localStorage.getItem("user"));
        const userId = userData?.id || userData?._id;
        try {
            const res = await fetch(`http://property.reworkstaging.name.ng/v1/users/${userId}/wishlist/${propertyId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.code === 200) {
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
            pending: { bg: "bg-amber-100", text: "text-amber-700", icon: ClockIcon },
            accepted: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircleIcon },
            rejected: { bg: "bg-red-100", text: "text-red-700", icon: XCircleIcon },
            completed: { bg: "bg-blue-100", text: "text-blue-700", icon: CheckCircleIcon }
        };
        const s = config[status?.toLowerCase()] || config.pending;
        const Icon = s.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                <Icon className="w-3 h-3" />
                {status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase()}
            </span>
        );
    };

    const tabs = [
        { id: "overview", label: "Overview", icon: HomeIcon },
        { id: "appointments", label: "Appointments", icon: CalendarDaysIcon, count: appointments.filter(a => a.status?.toLowerCase() === "pending").length },
        { id: "wishlist", label: "Wishlist", icon: HeartIcon, count: wishlist.length },
        { id: "profile", label: "Profile", icon: UserCircleIcon },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?auto=compress&cs=tinysrgb&w=1600')"
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-black/70"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border border-white/30">
                                <UserCircleIcon className="w-9 h-9 text-white" />
                            </div>
                            <div>
                                <p className="text-blue-200 text-sm">Welcome back</p>
                                <h1 className="text-2xl font-bold text-white">{user?.first_name} {user?.last_name}</h1>
                                <p className="text-blue-200 text-sm flex items-center gap-1 mt-1">
                                    <EnvelopeIcon className="w-3 h-3" /> {user?.email}
                                </p>
                            </div>
                        </div>

                        {/* Action buttons — Browse + Logout */}
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
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/20">
                            <CalendarDaysIcon className="w-6 h-6 text-blue-200 mx-auto mb-1" />
                            <p className="text-2xl font-bold text-white">{appointments.length}</p>
                            <p className="text-blue-200 text-xs">Appointments</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/20">
                            <HeartIcon className="w-6 h-6 text-blue-200 mx-auto mb-1" />
                            <p className="text-2xl font-bold text-white">{wishlist.length}</p>
                            <p className="text-blue-200 text-xs">Saved Properties</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/20">
                            <ClockIcon className="w-6 h-6 text-blue-200 mx-auto mb-1" />
                            <p className="text-2xl font-bold text-white">
                                {appointments.filter(a => a.status?.toLowerCase() === "pending").length}
                            </p>
                            <p className="text-blue-200 text-xs">Pending</p>
                        </div>
                    </div>
                </div>
            </div>

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
                                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition border-b-2 ${activeTab === tab.id
                                        ? "border-blue-600 text-blue-600 bg-blue-50"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                    {tab.count > 0 && (
                                        <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === "overview" && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <CalendarDaysIcon className="w-5 h-5 text-blue-600" />
                                    Recent Appointments
                                </h2>
                                <button onClick={() => setActiveTab("appointments")} className="text-blue-600 text-sm hover:underline">
                                    View all
                                </button>
                            </div>
                            {appointments.length === 0 ? (
                                <div className="text-center py-8">
                                    <CalendarDaysIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 mb-3">No appointments yet</p>
                                    <Link href="/public/properties" className="text-blue-600 text-sm hover:underline">
                                        Browse properties to book a viewing →
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {appointments.slice(0, 3).map((apt) => (
                                        <div key={apt._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                                    <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{apt.property?.name || "Property"}</p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
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

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <HeartIcon className="w-5 h-5 text-red-500" />
                                    Saved Properties
                                </h2>
                                <button onClick={() => setActiveTab("wishlist")} className="text-blue-600 text-sm hover:underline">
                                    View all
                                </button>
                            </div>
                            {wishlist.length === 0 ? (
                                <div className="text-center py-8">
                                    <HeartIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 mb-3">No saved properties</p>
                                    <Link href="/public/properties" className="text-blue-600 text-sm hover:underline">
                                        Explore properties →
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {wishlist.slice(0, 2).map((property) => (
                                        <Link href={`/public/properties/${property._id}`} key={property._id}>
                                            <div className="flex gap-3 p-3 border border-gray-100 rounded-xl hover:shadow-md transition">
                                                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    {property.images?.[0] ? (
                                                        <img src={property.images[0]} className="w-full h-full object-cover" alt={property.name} />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <HomeIcon className="w-8 h-8 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm line-clamp-1">{property.name}</p>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                        <MapPinIcon className="w-3 h-3" /> {property.city}, {property.state}
                                                    </p>
                                                    <p className="text-blue-600 font-bold text-sm mt-1">₦{property.price}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Appointments Tab */}
                {activeTab === "appointments" && (
                    <div className="space-y-4">
                        {appointments.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                                <CalendarDaysIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No Appointments Yet</h3>
                                <p className="text-gray-500 mb-4">Book your first property viewing</p>
                                <Link href="/public/properties" className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 inline-block text-sm font-medium">
                                    Browse Properties
                                </Link>
                            </div>
                        ) : (
                            appointments.map((apt) => (
                                <div key={apt._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex flex-wrap justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                                    <BuildingOfficeIcon className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">{apt.property?.name || "Property"}</h3>
                                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                                        <MapPinIcon className="w-3 h-3" /> {apt.property?.address}
                                                    </p>
                                                </div>
                                                {getStatusBadge(apt.status)}
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500 mb-1">Date</p>
                                                    <p className="font-medium text-sm">{apt.date}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500 mb-1">Time</p>
                                                    <p className="font-medium text-sm">{apt.time?.from} - {apt.time?.to}</p>
                                                </div>
                                                <div className="bg-gray-50 rounded-lg p-3">
                                                    <p className="text-xs text-gray-500 mb-1">Type</p>
                                                    <p className="font-medium text-sm">{apt.property?.type}</p>
                                                </div>
                                            </div>

                                            {apt.msg && (
                                                <div className="bg-blue-50 border border-blue-100 p-3 rounded-xl">
                                                    <p className="text-sm text-blue-700">
                                                        <span className="font-medium">Note:</span> {apt.msg}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2 min-w-[140px]">
                                            <Link href={`/public/properties/${apt.property_id}`}>
                                                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 text-sm font-medium">
                                                    <EyeIcon className="w-4 h-4" /> View Property
                                                </button>
                                            </Link>
                                            {apt.status?.toLowerCase() === "accepted" && (
                                                <button
                                                    onClick={() => confirmAppointment(apt._id)}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-medium"
                                                >
                                                    <CheckCircleIcon className="w-4 h-4" /> Confirm Done
                                                </button>
                                            )}
                                            {apt.status?.toLowerCase() === "pending" && (
                                                <button
                                                    onClick={() => cancelAppointment(apt._id)}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-xl hover:bg-red-50 text-sm font-medium"
                                                >
                                                    <XCircleIcon className="w-4 h-4" /> Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Wishlist Tab */}
                {activeTab === "wishlist" && (
                    <div>
                        {wishlist.length === 0 ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                                <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Your Wishlist is Empty</h3>
                                <p className="text-gray-500 mb-4">Save properties you love</p>
                                <Link href="/public/properties" className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 inline-block text-sm font-medium">
                                    Explore Properties
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {wishlist.map((property) => (
                                    <div key={property._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                                        <div className="h-48 bg-gray-100 relative">
                                            {property.images?.[0] ? (
                                                <img src={property.images[0]} alt={property.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <HomeIcon className="w-12 h-12 text-gray-400" />
                                                </div>
                                            )}
                                            <button
                                                onClick={() => removeFromWishlist(property._id)}
                                                className="absolute top-3 right-3 bg-white rounded-xl p-2 shadow-md hover:bg-red-50 transition"
                                            >
                                                <TrashIcon className="w-4 h-4 text-red-500" />
                                            </button>
                                            <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-lg font-medium">
                                                {property.type}
                                            </span>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-bold text-lg mb-1 line-clamp-1">{property.name}</h3>
                                            <p className="text-gray-500 text-sm mb-2 flex items-center gap-1">
                                                <MapPinIcon className="w-3 h-3" /> {property.city}, {property.state}
                                            </p>
                                            <p className="text-blue-600 font-bold text-xl mb-4">₦{property.price}</p>
                                            <Link href={`/public/properties/${property._id}`}>
                                                <button className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition text-sm font-medium">
                                                    <EyeIcon className="w-4 h-4" /> View Details
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === "profile" && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                        <UserCircleIcon className="w-9 h-9 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{user?.first_name} {user?.last_name}</h2>
                                        <p className="text-blue-200 text-sm">Tenant Account</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                    <EnvelopeIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="font-medium">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                    <PhoneIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="font-medium">{user?.phone || "Not provided"}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                    <CalendarDaysIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500">Member Since</p>
                                        <p className="font-medium">
                                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-2 flex flex-col gap-3">
                                    <Link href="/public">
                                        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition">
                                            <HomeIcon className="w-5 h-5" />
                                            Browse Properties
                                        </button>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition"
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