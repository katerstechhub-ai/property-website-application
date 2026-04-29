"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    UsersIcon,
    UserGroupIcon,
    BuildingOfficeIcon,
    ClockIcon,
    CalendarDaysIcon,
    StarIcon,
    PlusCircleIcon,
    ArrowRightOnRectangleIcon,
    ChartBarIcon,
    DocumentTextIcon,
    ShieldCheckIcon,
    PencilIcon,
    CheckIcon,
    XMarkIcon,
    ArrowPathIcon
} from "@heroicons/react/24/outline";

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState({
        users: 0, agents: 0, properties: 0,
        pendingProperties: 0, appointments: 0, reviews: 0
    });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [adminName, setAdminName] = useState("Admin");
    const [editingName, setEditingName] = useState(false);
    const [tempName, setTempName] = useState("");

    const getToken = () => localStorage.getItem("token");

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) { 
            router.push("/admin/login"); 
            return; 
        }
        try {
            const user = JSON.parse(userData);
            const name = user.full_name || user.first_name || "Admin";
            setAdminName(name);
            setTempName(name);
        } catch (e) {}
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        const token = getToken();
        if (!token) {
            setLoading(false);
            return;
        }
        
        try {
            const [usersRes, agentsRes, propsRes, aptRes, reviewsRes] = await Promise.all([
                fetch("http://property.reworkstaging.name.ng/v1/users?limit=100", { 
                    headers: { "Authorization": `Bearer ${token}` } 
                }),
                fetch("http://property.reworkstaging.name.ng/v1/agents", { 
                    headers: { "Authorization": `Bearer ${token}` } 
                }),
                fetch("http://property.reworkstaging.name.ng/v1/properties", { 
                    headers: { "Authorization": `Bearer ${token}` } 
                }),
                fetch("http://property.reworkstaging.name.ng/v1/appointments", { 
                    headers: { "Authorization": `Bearer ${token}` } 
                }),
                fetch("http://property.reworkstaging.name.ng/v1/reviews", { 
                    headers: { "Authorization": `Bearer ${token}` } 
                })
            ]);

            const [usersData, agentsData, propsData, aptData, reviewsData] = await Promise.all([
                usersRes.json(), agentsRes.json(), propsRes.json(), aptRes.json(), reviewsRes.json()
            ]);

            // Get agents count - handle different response structures
            let agentsCount = 0;
            if (agentsData.data && Array.isArray(agentsData.data)) {
                agentsCount = agentsData.data.length;
            } else if (Array.isArray(agentsData)) {
                agentsCount = agentsData.length;
            }

            const properties = propsData.data || [];
            setStats({
                users: usersData.data?.length || 0,
                agents: agentsCount,
                properties: properties.length,
                pendingProperties: properties.filter(p => !p.is_verified).length,
                appointments: aptData.data?.length || 0,
                reviews: reviewsData.data?.length || 0
            });
        } catch (err) {
            console.error("Error fetching admin data:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAdminData();
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/admin/login");
    };

    const updateAdminName = async (newName) => {
        const userData = localStorage.getItem("user");
        if (!userData) return;
        const user = JSON.parse(userData);
        user.full_name = newName;
        user.first_name = newName;
        localStorage.setItem("user", JSON.stringify(user));
    };

    const statsCards = [
        { title: "Total Users", value: stats.users, icon: UsersIcon, color: "blue", href: "/admin/users" },
        { title: "Total Agents", value: stats.agents, icon: UserGroupIcon, color: "green", href: "/admin/agents" },
        { title: "Properties", value: stats.properties, icon: BuildingOfficeIcon, color: "purple", href: "/admin/properties" },
        { title: "Pending Verification", value: stats.pendingProperties, icon: ClockIcon, color: "yellow", href: "/admin/properties?filter=pending" },
        { title: "Appointments", value: stats.appointments, icon: CalendarDaysIcon, color: "indigo", href: "/admin/appointments" },
        { title: "Reviews", value: stats.reviews, icon: StarIcon, color: "pink", href: "/admin/reviews" }
    ];

    const quickActions = [
        { title: "Add New Agent", href: "/admin/agents/create", icon: PlusCircleIcon, color: "bg-green-600 hover:bg-green-700" },
        { title: "Create Property", href: "/admin/properties/create", icon: BuildingOfficeIcon, color: "bg-emerald-600 hover:bg-emerald-700" },
        { title: "Manage Properties", href: "/admin/properties", icon: BuildingOfficeIcon, color: "bg-purple-600 hover:bg-purple-700" },
        { title: "Manage Users", href: "/admin/users", icon: UsersIcon, color: "bg-blue-600 hover:bg-blue-700" },
        { title: "Manage Agents", href: "/admin/agents", icon: UserGroupIcon, color: "bg-orange-600 hover:bg-orange-700" }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600')" }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-900/85 via-red-800/75 to-rose-900/85"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border border-white/30">
                                <ShieldCheckIcon className="w-9 h-9 text-white" />
                            </div>
                            <div>
                                <p className="text-red-200 text-sm">Welcome back,</p>
                                {editingName ? (
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <input 
                                            type="text" 
                                            value={tempName} 
                                            onChange={(e) => setTempName(e.target.value)}
                                            className="bg-white/20 rounded-lg px-3 py-1 text-white text-2xl font-bold outline-none focus:ring-2 focus:ring-white/50"
                                            autoFocus
                                        />
                                        <button 
                                            onClick={() => {
                                                setAdminName(tempName);
                                                setEditingName(false);
                                                updateAdminName(tempName);
                                            }}
                                            className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-lg transition"
                                        >
                                            <CheckIcon className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setEditingName(false);
                                                setTempName(adminName);
                                            }}
                                            className="bg-gray-500 hover:bg-gray-600 text-white p-1.5 rounded-lg transition"
                                        >
                                            <XMarkIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-bold text-white">{adminName}</h1>
                                        <button 
                                            onClick={() => setEditingName(true)}
                                            className="text-white/50 hover:text-white transition p-1"
                                            title="Edit name"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                                <p className="text-red-200 text-sm">System Administrator</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                            >
                                <ArrowPathIcon className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                                {refreshing ? "Refreshing..." : "Refresh"}
                            </button>
                            <button onClick={handleLogout} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
                                <ArrowRightOnRectangleIcon className="w-4 h-4" /> Logout
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
                        {statsCards.map((stat, idx) => {
                            const Icon = stat.icon;
                            return (
                                <Link key={idx} href={stat.href}>
                                    <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/20 hover:bg-white/20 transition cursor-pointer">
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                                        <p className="text-gray-300 text-xs">{stat.title}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content - Light Theme */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    {quickActions.map((action, idx) => {
                        const Icon = action.icon;
                        return (
                            <Link key={idx} href={action.href}>
                                <button className={`w-full ${action.color} text-white p-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-sm`}>
                                    <Icon className="w-4 h-4" /> {action.title}
                                </button>
                            </Link>
                        );
                    })}
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                    <div className="flex overflow-x-auto">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition border-b-2 ${activeTab === "overview" ? "border-red-600 text-red-600 bg-red-50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
                        >
                            <ChartBarIcon className="w-4 h-4" /> Overview
                        </button>
                        <button
                            onClick={() => setActiveTab("recentActivity")}
                            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition border-b-2 ${activeTab === "recentActivity" ? "border-red-600 text-red-600 bg-red-50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
                        >
                            <DocumentTextIcon className="w-4 h-4" /> Recent Activity
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <ClockIcon className="w-5 h-5 text-yellow-500" /> Pending Property Verifications
                            </h2>
                            <p className="text-3xl font-bold text-yellow-600 mb-2">{stats.pendingProperties}</p>
                            <p className="text-gray-500 text-sm mb-4">properties waiting for verification</p>
                            <Link href="/admin/properties?filter=pending">
                                <button className="text-red-600 text-sm font-medium hover:underline">Review Properties →</button>
                            </Link>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <BuildingOfficeIcon className="w-5 h-5 text-blue-500" /> Platform Summary
                            </h2>
                            <div className="space-y-3">
                                {[
                                    { label: "Total Agents", value: stats.agents },
                                    { label: "Total Users", value: stats.users },
                                    { label: "Total Properties", value: stats.properties },
                                    { label: "Active Listings", value: stats.properties - stats.pendingProperties },
                                    { label: "Total Appointments", value: stats.appointments },
                                    { label: "Total Reviews", value: stats.reviews },
                                ].map((item, i) => (
                                    <div key={i} className="flex justify-between py-2 border-b last:border-0">
                                        <span className="text-gray-600">{item.label}</span>
                                        <span className="font-bold text-gray-900">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "recentActivity" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                        <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Recent Platform Activity</h3>
                        <p className="text-gray-500">Activity feed will appear here as users interact with the platform</p>
                    </div>
                )}
            </div>
        </div>
    );
}