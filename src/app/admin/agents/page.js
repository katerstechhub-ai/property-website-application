"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    UserGroupIcon,
    PlusCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    BuildingOfficeIcon,
    TrashIcon,
    MagnifyingGlassIcon,
    CalendarDaysIcon,
    BriefcaseIcon,
    ArrowPathIcon
} from "@heroicons/react/24/outline";

export default function AdminAgents() {
    const router = useRouter();
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [error, setError] = useState("");

    const fetchAgents = async () => {
        setLoading(true);
        setError("");
        
        const token = localStorage.getItem("token");
        
        if (!token) {
            setError("Not logged in. Please login again.");
            setLoading(false);
            router.push("/admin/login");
            return;
        }

        try {
            // First try /merchants/agents endpoint
            let res = await fetch("http://property.reworkstaging.name.ng/v1/merchants/agents", {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            
            let data = await res.json();
            
            // If that fails, try /agents endpoint
            if (!res.ok) {
                res = await fetch("http://property.reworkstaging.name.ng/v1/agents", {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                data = await res.json();
            }
            
            if (res.ok) {
                // Handle different response structures
                if (data.data && Array.isArray(data.data)) {
                    setAgents(data.data);
                } else if (Array.isArray(data)) {
                    setAgents(data);
                } else if (data.agents && Array.isArray(data.agents)) {
                    setAgents(data.agents);
                } else {
                    setAgents([]);
                }
                console.log("Agents loaded:", agents.length);
            } else {
                setError(data.message || data.msg || "Failed to fetch agents");
            }
        } catch (err) {
            console.error("Error fetching agents:", err);
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) {
            router.push("/admin/login");
            return;
        }
        fetchAgents();
    }, []);

    const deleteAgent = async (agentId) => {
        if (!confirm("Are you sure you want to remove this agent?")) return;
        setDeleteLoading(agentId);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`http://property.reworkstaging.name.ng/v1/agents/${agentId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) {
                setAgents(prev => prev.filter(a => a._id !== agentId));
            } else {
                const data = await res.json();
                alert(data.message || "Failed to delete agent");
            }
        } catch (err) {
            console.error("Error deleting agent:", err);
        } finally {
            setDeleteLoading(null);
        }
    };

    const filteredAgents = agents.filter(agent =>
        agent.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        agent.email?.toLowerCase().includes(search.toLowerCase()) ||
        agent.company?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <Link href="/admin" className="inline-flex items-center text-red-600 hover:text-red-700 text-sm font-medium mb-4 group">
                    <span className="mr-1 group-hover:-translate-x-0.5 transition">←</span> Back to Dashboard
                </Link>
                <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Agents</h1>
                        <p className="text-gray-500 mt-1">Create, view and remove platform agents</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchAgents}
                            className="flex items-center gap-2 border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-xl text-sm font-medium transition"
                        >
                            <ArrowPathIcon className="w-4 h-4" />
                            Refresh
                        </button>
                        <Link href="/admin/agents/create">
                            <button className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-md shadow-red-200">
                                <PlusCircleIcon className="w-5 h-5" />
                                Create New Agent
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl">
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Debug Info */}
            <div className="mb-4 p-3 bg-gray-100 rounded-lg text-xs">
                <p><strong>Debug:</strong> Found {agents.length} agents in database</p>
                <p><strong>Token exists:</strong> {localStorage.getItem("token") ? "Yes" : "No"}</p>
            </div>

            {/* Search + count */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email or company..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-red-400 outline-none text-sm bg-white shadow-sm"
                    />
                </div>
                <span className="text-sm text-gray-500 font-medium bg-gray-100 px-4 py-2 rounded-xl">
                    {filteredAgents.length} agent{filteredAgents.length !== 1 ? "s" : ""}
                </span>
            </div>

            {/* Agents Grid */}
            {filteredAgents.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                    <UserGroupIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No Agents Found</h3>
                    <p className="text-gray-400 mb-6">
                        {search ? "No agents match your search." : "You haven't created any agents yet."}
                    </p>
                    <Link href="/admin/agents/create">
                        <button className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition">
                            <PlusCircleIcon className="w-4 h-4" /> Create First Agent
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredAgents.map((agent) => (
                        <div key={agent._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden group">
                            <div className="h-2 bg-gradient-to-r from-red-500 to-rose-500" />
                            <div className="p-5">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-100 to-rose-100 flex items-center justify-center flex-shrink-0">
                                        <BriefcaseIcon className="w-6 h-6 text-red-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate">{agent.full_name || "—"}</h3>
                                        {agent.company && (
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                <BuildingOfficeIcon className="w-3 h-3" />
                                                {agent.company}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                        <span className="truncate">{agent.email}</span>
                                    </div>
                                    {agent.phone && (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <PhoneIcon className="w-4 h-4 text-gray-400" />
                                            <span>{agent.phone}</span>
                                        </div>
                                    )}
                                    {agent.createdAt && (
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <CalendarDaysIcon className="w-4 h-4" />
                                            <span>{new Date(agent.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
                                    <p className="text-xs text-gray-400">Agent ID</p>
                                    <p className="text-xs font-mono text-gray-600">{agent._id?.slice(-16)}</p>
                                </div>

                                <button
                                    onClick={() => deleteAgent(agent._id)}
                                    disabled={deleteLoading === agent._id}
                                    className="w-full flex items-center justify-center gap-2 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    {deleteLoading === agent._id ? "Removing..." : "Remove Agent"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}